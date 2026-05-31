import { homedir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import type {
  CoralExecutedQuery,
  CoralExecutionTrace,
  ContributorReadinessReport,
  CoralRepoInsights,
} from "@/types/coral";
import type { CommitSummary, RepositorySummary } from "@/types/repository";

const execFileAsync = promisify(execFile);

type CoralRepositoryRow = {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
  default_branch: string;
  language: string | null;
  name: string;
};

type CoralCommitRow = {
  sha: string;
  commit__message: string | null;
  commit__author__name: string | null;
  commit__author__date: string | null;
};

type CoralReadinessRow = {
  repo_health: string;
  beginner_friendliness: string;
  contribution_difficulty: string;
  recommended_starting_point: string;
};

export async function fetchCoralRepositorySummary(
  owner: string,
  repo: string,
  trace?: CoralExecutionTrace,
): Promise<RepositorySummary> {
  console.info(`[Coral] Loading repository summary for ${owner}/${repo}`);

  const [repositoryRows, commitRows] = await Promise.all([
    runCoralQuery<CoralRepositoryRow[]>(
      `SELECT full_name, description, stargazers_count, html_url, default_branch, language, name
       FROM github.repos_get
       WHERE owner = '${escapeSqlLiteral(owner)}' AND repo = '${escapeSqlLiteral(repo)}'
       LIMIT 1`,
      trace,
    ),
    runCoralQuery<CoralCommitRow[]>(
      `SELECT sha, commit__message, commit__author__name, commit__author__date
       FROM github.commits
       WHERE owner = '${escapeSqlLiteral(owner)}' AND repo = '${escapeSqlLiteral(repo)}'
       LIMIT 5`,
      trace,
    ).catch((error) => {
      console.warn(
        `[Coral] Commit query failed for ${owner}/${repo}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
      return [];
    }),
  ]);

  const repository = repositoryRows[0];

  if (!repository) {
    throw new Error("This repository could not be found via Coral.");
  }

  const recentCommits: CommitSummary[] = commitRows.map((commit) => ({
    sha: commit.sha,
    message: commit.commit__message?.split("\n")[0] || "No commit message",
    author: commit.commit__author__name || "Unknown author",
    date: commit.commit__author__date || new Date(0).toISOString(),
  }));

  console.info(
    `[Coral] Repository summary ready for ${owner}/${repo} with ${recentCommits.length} commits`,
  );

  return {
    name: repository.full_name,
    description: repository.description,
    stars: repository.stargazers_count,
    url: repository.html_url,
    languages: repository.language ? [repository.language] : [],
    recentCommits,
    owner,
    repository: repository.name,
    defaultBranch: repository.default_branch,
  };
}

export async function fetchCoralRepoInsights(
  owner: string,
  repo: string,
  trace?: CoralExecutionTrace,
): Promise<CoralRepoInsights> {
  console.info(`[Coral] Loading issue and pull request insights for ${owner}/${repo}`);
  const repoQuery = `repo:${owner}/${repo}`;
  const [issueCountRows, pullCountRows, issueRows, pullRows] = await Promise.all([
    runCoralQuery<Array<{ open_issue_count: number }>>(
      `SELECT count(*) AS open_issue_count FROM github.search_issues(q => '${repoQuery} is:issue state:open')`,
      trace,
    ),
    runCoralQuery<Array<{ open_pull_request_count: number }>>(
      `SELECT count(*) AS open_pull_request_count FROM github.search_issues(q => '${repoQuery} is:pr state:open')`,
      trace,
    ),
    runCoralQuery<Array<{ title: string; html_url: string }>>(
      `SELECT title, html_url FROM github.search_issues(q => '${repoQuery} is:issue state:open sort:updated-desc') LIMIT 3`,
      trace,
    ),
    runCoralQuery<Array<{ title: string; html_url: string }>>(
      `SELECT title, html_url FROM github.search_issues(q => '${repoQuery} is:pr state:open sort:updated-desc') LIMIT 3`,
      trace,
    ),
  ]);

  return {
    openIssueCount: issueCountRows[0]?.open_issue_count ?? 0,
    openPullRequestCount: pullCountRows[0]?.open_pull_request_count ?? 0,
    topOpenIssues: issueRows.map((row) => ({
      title: row.title,
      url: row.html_url,
    })),
    topOpenPullRequests: pullRows.map((row) => ({
      title: row.title,
      url: row.html_url,
    })),
  };
}

export async function fetchContributorReadinessReport(
  owner: string,
  repo: string,
  trace?: CoralExecutionTrace,
): Promise<ContributorReadinessReport> {
  console.info(
    `[Coral] Loading contributor readiness report for ${owner}/${repo}`,
  );

  const escapedOwner = escapeSqlLiteral(owner);
  const escapedRepo = escapeSqlLiteral(repo);
  const repoQuery = escapeSqlLiteral(`repo:${owner}/${repo}`);

  const rows = await runCoralQuery<CoralReadinessRow[]>(
    `
    WITH repo AS (
      SELECT
        full_name,
        stargazers_count,
        default_branch,
        language,
        has_issues,
        has_wiki
      FROM github.repos_get
      WHERE owner = '${escapedOwner}' AND repo = '${escapedRepo}'
      LIMIT 1
    ),
    recent_commits AS (
      SELECT
        count(*) AS recent_commit_count,
        max(commit__author__date) AS latest_commit_date
      FROM (
        SELECT commit__author__date
        FROM github.commits
        WHERE owner = '${escapedOwner}' AND repo = '${escapedRepo}'
        LIMIT 20
      ) recent_commit_window
    ),
    open_issues AS (
      SELECT count(*) AS open_issue_count
      FROM github.search_issues(q => '${repoQuery} is:issue state:open')
    ),
    open_prs AS (
      SELECT count(*) AS open_pr_count
      FROM github.search_issues(q => '${repoQuery} is:pr state:open')
    ),
    joined AS (
      SELECT
        repo.full_name,
        repo.stargazers_count,
        repo.default_branch,
        repo.language,
        repo.has_issues,
        repo.has_wiki,
        recent_commits.recent_commit_count,
        recent_commits.latest_commit_date,
        open_issues.open_issue_count,
        open_prs.open_pr_count
      FROM repo
      CROSS JOIN recent_commits
      CROSS JOIN open_issues
      CROSS JOIN open_prs
    )
    SELECT
      CASE
        WHEN recent_commit_count >= 10 AND open_issue_count BETWEEN 1 AND 75 THEN 'Active and contribution-ready'
        WHEN recent_commit_count >= 3 AND open_issue_count > 0 THEN 'Active but needs contributor guidance'
        WHEN open_issue_count = 0 AND open_pr_count = 0 THEN 'Stable but low visible contribution activity'
        ELSE 'Mixed repository health signals'
      END AS repo_health,
      CASE
        WHEN has_issues = true AND open_issue_count BETWEEN 1 AND 40 AND stargazers_count >= 1 THEN 'Good for beginners'
        WHEN has_issues = true AND open_issue_count > 40 THEN 'Moderate for beginners'
        ELSE 'Needs deeper code reading before beginner contributions'
      END AS beginner_friendliness,
      CASE
        WHEN open_pr_count > 20 OR recent_commit_count >= 15 THEN 'Medium to high'
        WHEN open_issue_count > 0 AND recent_commit_count >= 3 THEN 'Medium'
        ELSE 'Low to medium'
      END AS contribution_difficulty,
      CASE
        WHEN open_issue_count > 0 THEN 'Start with the open issues surfaced by Coral and look for labels or recently updated tickets.'
        WHEN open_pr_count > 0 THEN 'Review open pull requests to understand current coding patterns and active work.'
        WHEN recent_commit_count > 0 THEN 'Read the most recent commits to identify the most active code paths before contributing.'
        ELSE 'Begin with the repository README and project structure because live activity signals are limited.'
      END AS recommended_starting_point
    FROM joined
    LIMIT 1
    `,
    trace,
  );

  const row = rows[0];

  if (!row) {
    throw new Error("Contributor readiness report could not be generated via Coral.");
  }

  return {
    repoHealth: row.repo_health,
    beginnerFriendliness: row.beginner_friendliness,
    contributionDifficulty: row.contribution_difficulty,
    recommendedStartingPoint: row.recommended_starting_point,
  };
}

export function createCoralExecutionTrace(): CoralExecutionTrace {
  return {
    queries: [],
  };
}

async function runCoralQuery<T>(
  sql: string,
  trace?: CoralExecutionTrace,
): Promise<T> {
  const coralBinary =
    process.env.CORAL_BIN ?? join(homedir(), ".local", "bin", "coral.exe");

  const normalizedSql = sql.replace(/\s+/g, " ").trim();
  console.info(`[Coral] Executing SQL: ${normalizedSql}`);
  recordCoralQuery(trace, normalizedSql);

  const { stdout } = await execFileAsync(
    coralBinary,
    ["sql", "--format", "json", sql],
    {
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 8,
    },
  );

  return JSON.parse(stdout) as T;
}

function escapeSqlLiteral(value: string) {
  return value.replace(/'/g, "''");
}

function recordCoralQuery(
  trace: CoralExecutionTrace | undefined,
  sql: string,
) {
  if (!trace) {
    return;
  }

  const sourceTables = Array.from(
    new Set(
      [...sql.matchAll(/\bgithub\.[a-zA-Z0-9_]+/g)].map((match) => match[0]),
    ),
  );

  const query: CoralExecutedQuery = {
    sql,
    sourceTables,
  };

  trace.queries.push(query);
}

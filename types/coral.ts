export type CoralRepoInsights = {
  openIssueCount: number;
  openPullRequestCount: number;
  topOpenIssues: Array<{
    title: string;
    url: string;
  }>;
  topOpenPullRequests: Array<{
    title: string;
    url: string;
  }>;
};

export type ContributorReadinessReport = {
  repoHealth: string;
  beginnerFriendliness: string;
  contributionDifficulty: string;
  recommendedStartingPoint: string;
};

export type CoralExecutedQuery = {
  sql: string;
  sourceTables: string[];
};

export type CoralExecutionTrace = {
  queries: CoralExecutedQuery[];
};

export type DeveloperInsights = {
  coralQueriesExecuted: number;
  sourcesUsed: string[];
  issuesAnalyzed: number;
  pullRequestsAnalyzed: number;
  commitsAnalyzed: number;
  executedQueries: CoralExecutedQuery[];
};

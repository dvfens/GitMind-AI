import type { RepositorySummary } from "@/types/repository";

type GitHubRepositoryResponse = {
  description: string | null;
  stargazers_count: number;
  html_url: string;
  full_name: string;
  name: string;
  owner: {
    login: string;
  };
  default_branch: string;
};

type GitHubLanguagesResponse = Record<string, number>;

type GitHubCommitResponse = {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
};

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
};

export async function fetchRepositorySummary(
  owner: string,
  repo: string,
): Promise<RepositorySummary> {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    ...GITHUB_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const [repositoryResponse, languagesResponse, commitsResponse] =
    await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers,
        next: {
          revalidate: 300,
        },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers,
        next: {
          revalidate: 300,
        },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, {
        headers,
        next: {
          revalidate: 300,
        },
      }),
    ]);

  if (!repositoryResponse.ok) {
    if (repositoryResponse.status === 404) {
      throw new Error("This repository could not be found on GitHub.");
    }

    if (repositoryResponse.status === 403) {
      throw new Error(
        "GitHub rate-limited the request. Add GITHUB_TOKEN in .env.local for more reliable local usage.",
      );
    }

    throw new Error(
      `GitHub repository request failed with status ${repositoryResponse.status}.`,
    );
  }

  if (!languagesResponse.ok) {
    throw new Error(
      `GitHub languages request failed with status ${languagesResponse.status}.`,
    );
  }

  if (!commitsResponse.ok) {
    if (commitsResponse.status === 409) {
      const repository = (await repositoryResponse.json()) as GitHubRepositoryResponse;
      const languages =
        (await languagesResponse.json()) as GitHubLanguagesResponse;

      return {
        name: repository.full_name,
        description: repository.description,
        stars: repository.stargazers_count,
        url: repository.html_url,
        languages: Object.keys(languages),
        recentCommits: [],
        owner: repository.owner.login,
        repository: repository.name,
        defaultBranch: repository.default_branch,
      };
    }

    throw new Error(
      `GitHub commits request failed with status ${commitsResponse.status}.`,
    );
  }

  const repository = (await repositoryResponse.json()) as GitHubRepositoryResponse;
  const languages =
    (await languagesResponse.json()) as GitHubLanguagesResponse;
  const commits = (await commitsResponse.json()) as GitHubCommitResponse[];

  return {
    name: repository.full_name,
    description: repository.description,
    stars: repository.stargazers_count,
    url: repository.html_url,
    languages: Object.keys(languages),
    recentCommits: commits.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message.split("\n")[0] ?? "No commit message",
      author: commit.commit.author.name,
      date: commit.commit.author.date,
    })),
    owner: repository.owner.login,
    repository: repository.name,
    defaultBranch: repository.default_branch,
  };
}

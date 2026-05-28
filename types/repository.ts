export type CommitSummary = {
  sha: string;
  message: string;
  author: string;
  date: string;
};

export type RepositorySummary = {
  name: string;
  description: string | null;
  stars: number;
  url: string;
  languages: string[];
  recentCommits: CommitSummary[];
  owner: string;
  repository: string;
  defaultBranch: string;
};

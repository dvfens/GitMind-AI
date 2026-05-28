import type { RepositorySummary } from "@/types/repository";

export interface RepositoryInsightProvider {
  getRepositorySummary(owner: string, repo: string): Promise<RepositorySummary>;
}

export class CoralInsightProvider implements RepositoryInsightProvider {
  async getRepositorySummary(): Promise<RepositorySummary> {
    throw new Error(
      "Coral integration is not implemented yet. Use the GitHub provider in Phase 2.",
    );
  }
}

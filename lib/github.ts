import { fetchCoralRepositorySummary } from "@/lib/coral";
import type { CoralExecutionTrace } from "@/types/coral";
import type { RepositorySummary } from "@/types/repository";

export async function fetchRepositorySummary(
  owner: string,
  repo: string,
  trace?: CoralExecutionTrace,
): Promise<RepositorySummary> {
  console.info(`[Coral] fetchRepositorySummary delegating to Coral for ${owner}/${repo}`);
  return fetchCoralRepositorySummary(owner, repo, trace);
}

export type ParsedRepoUrl = {
  owner: string;
  repo: string;
  normalizedUrl: string;
};

export function parseGitHubRepoUrl(input: string): ParsedRepoUrl | null {
  try {
    const trimmed = input.trim();
    const url = new URL(trimmed);

    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
      return null;
    }

    const segments = url.pathname.split("/").filter(Boolean);

    if (segments.length < 2) {
      return null;
    }

    const owner = sanitizeSegment(segments[0]);
    const repo = sanitizeSegment(segments[1].replace(/\.git$/, ""));

    if (!owner || !repo) {
      return null;
    }

    return {
      owner,
      repo,
      normalizedUrl: `https://github.com/${owner}/${repo}`,
    };
  } catch {
    return null;
  }
}

function sanitizeSegment(segment: string) {
  const value = segment.trim();

  if (!/^[A-Za-z0-9._-]+$/.test(value)) {
    return null;
  }

  return value;
}

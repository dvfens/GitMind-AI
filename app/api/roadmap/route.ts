import { NextResponse } from "next/server";
import { DEFAULT_OPENROUTER_MODEL } from "@/lib/model-storage";
import type { CoralRepoInsights } from "@/types/coral";
import type { FirstContributionRoadmap } from "@/types/roadmap";
import type { RepositorySummary } from "@/types/repository";

type RoadmapRequestBody = {
  model?: string;
  repository?: RepositorySummary;
  coralInsights?: CoralRepoInsights | null;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl =
    process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is missing from the server environment." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as RoadmapRequestBody;
  const repository = body.repository;
  const coralInsights = body.coralInsights;
  const model = body.model?.trim() || DEFAULT_OPENROUTER_MODEL;

  if (!repository) {
    return NextResponse.json(
      { error: "Repository context is required for roadmap generation." },
      { status: 400 },
    );
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You create beginner-friendly first contribution roadmaps for GitHub repositories. Return valid JSON only.",
        },
        {
          role: "user",
          content: buildRoadmapPrompt(repository, coralInsights),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    return NextResponse.json(
      {
        error: `OpenRouter roadmap request failed with status ${response.status}. ${errorText}`,
      },
      { status: 500 },
    );
  }

  const payload = (await response.json()) as OpenRouterResponse;
  const content = payload.choices?.[0]?.message?.content;
  const textContent = Array.isArray(content)
    ? content
        .map((part) => ("text" in part && part.text ? part.text : ""))
        .join("")
    : content;

  if (!textContent) {
    return NextResponse.json(
      { error: "OpenRouter returned an empty roadmap response." },
      { status: 500 },
    );
  }

  try {
    const roadmap = JSON.parse(textContent) as FirstContributionRoadmap;

    return NextResponse.json({
      roadmap,
      model,
    });
  } catch {
    return NextResponse.json(
      { error: "OpenRouter returned roadmap data in an unexpected format." },
      { status: 500 },
    );
  }
}

function buildRoadmapPrompt(
  repository: RepositorySummary,
  coralInsights: CoralRepoInsights | null | undefined,
) {
  const commitLines = repository.recentCommits
    .map(
      (commit) =>
        `- ${commit.message} by ${commit.author} on ${commit.date} (${commit.sha.slice(0, 7)})`,
    )
    .join("\n");

  const coralSection = coralInsights
    ? `
Coral repository context:
- Open issues: ${coralInsights.openIssueCount}
- Open pull requests: ${coralInsights.openPullRequestCount}
- Top open issues: ${coralInsights.topOpenIssues.map((issue) => issue.title).join(" | ") || "None"}
- Top open pull requests: ${coralInsights.topOpenPullRequests.map((pull) => pull.title).join(" | ") || "None"}
`
    : `
Coral repository context:
- Not available for this repository.
`;

  return `
Create a beginner-friendly 5-day first contribution roadmap for this GitHub repository.

Return JSON with exactly this shape:
{
  "days": [
    { "day": "Day 1", "title": string, "description": string },
    { "day": "Day 2", "title": string, "description": string },
    { "day": "Day 3", "title": string, "description": string },
    { "day": "Day 4", "title": string, "description": string },
    { "day": "Day 5", "title": string, "description": string }
  ]
}

Repository:
- Name: ${repository.name}
- Owner: ${repository.owner}
- Repo: ${repository.repository}
- URL: ${repository.url}
- Description: ${repository.description ?? "No description provided"}
- Stars: ${repository.stars}
- Default branch: ${repository.defaultBranch}
- Languages: ${repository.languages.join(", ") || "Unknown"}

Recent commits:
${commitLines || "- No commits available"}

${coralSection}

Requirements:
- Make the roadmap beginner-friendly and practical.
- Use this sequence conceptually:
  Day 1: understand project structure
  Day 2: set up local environment
  Day 3: review beginner-friendly issues
  Day 4: make first contribution
  Day 5: open first pull request
- Tailor each day to the repository context rather than writing generic advice.
- Keep each description concise but actionable.
`;
}

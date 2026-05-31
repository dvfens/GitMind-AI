import { NextResponse } from "next/server";
import { DEFAULT_OPENROUTER_MODEL } from "@/lib/model-storage";
import type { RepositoryAnalysis } from "@/types/analysis";
import type { RepositorySummary } from "@/types/repository";

type AnalyzeRequestBody = {
  model?: string;
  repository?: RepositorySummary;
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

  const body = (await request.json()) as AnalyzeRequestBody;
  const repository = body.repository;
  const model = body.model?.trim() || DEFAULT_OPENROUTER_MODEL;

  if (!repository) {
    return NextResponse.json(
      { error: "Repository context is required for analysis." },
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
            "You explain GitHub repositories to beginners and contributors. Return valid JSON only.",
        },
        {
          role: "user",
          content: buildAnalysisPrompt(repository),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    return NextResponse.json(
      {
        error: `OpenRouter request failed with status ${response.status}. ${errorText}`,
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
      { error: "OpenRouter returned an empty analysis response." },
      { status: 500 },
    );
  }

  try {
    const analysis = JSON.parse(textContent) as RepositoryAnalysis;

    return NextResponse.json({
      analysis,
      model,
    });
  } catch {
    return NextResponse.json(
      { error: "OpenRouter returned analysis in an unexpected format." },
      { status: 500 },
    );
  }
}

function buildAnalysisPrompt(repository: RepositorySummary) {
  const commitLines = repository.recentCommits
    .map(
      (commit) =>
        `- ${commit.message} by ${commit.author} on ${commit.date} (${commit.sha.slice(0, 7)})`,
    )
    .join("\n");

  return `
Analyze this GitHub repository and return JSON with exactly these keys:
- beginnerExplanation: string
- contributionAreas: string[]
- gettingStarted: string[]
- commitSummary: string
- architectureNotes: string[]

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

Requirements:
- Explain in simple, direct language.
- Be practical and specific, but do not invent unsupported details.
- Keep each list between 3 and 5 items.
- Make the guidance useful for a beginner trying to contribute.
`;
}

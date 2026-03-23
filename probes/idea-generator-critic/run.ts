import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// Load .env file if exists (local dev)
config();

// ============================================
// Configuration
// ============================================

const CONFIG = {
  model: "claude-sonnet-4-6",
  maxTokens: 8192,
  outputDir: "./output",
} as const;

// ============================================
// Types
// ============================================

interface AgentDocuments {
  context: string;
  frontmatterSpec: string;
  outputTemplate: string;
  evaluationCriteria: string;
  refinementProtocol: string;
  agentDefinition: string;
}

interface ExistingIdea {
  index: number;
  filename: string;
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
  score: number;
}

interface ExternalInspirations {
  hackerNewsTopics: string[];
  githubTrending: string[];
  devToArticles: string[];
  redditTopics: string[];
  weeklyConstraint: string;
  crossDomain: string;
}

interface ScoreDistribution {
  total: number;
  histogram: Record<string, number>;
  mostCommonScore: string;
  mostCommonPct: number;
  warning: string | null;
}

interface GenerationResult {
  status: "pass" | "fail";
  score: number;
  iterations: number;
  filename: string;
  content: string;
  title: string;
}

// ============================================
// Document Loader
// ============================================

async function loadDocuments(agentDir: string): Promise<AgentDocuments> {
  const readFile = async (filename: string): Promise<string> => {
    const filePath = path.join(agentDir, filename);
    return fs.readFile(filePath, "utf-8");
  };

  const [
    context,
    frontmatterSpec,
    outputTemplate,
    evaluationCriteria,
    refinementProtocol,
    agentDefinition,
  ] = await Promise.all([
    readFile("0-context.md"),
    readFile("1-frontmatter-spec.md"),
    readFile("2-output-template.md"),
    readFile("3-evaluation-criteria.md"),
    readFile("4-refinement-protocol.md"),
    readFile("agent.md"),
  ]);

  return {
    context,
    frontmatterSpec,
    outputTemplate,
    evaluationCriteria,
    refinementProtocol,
    agentDefinition,
  };
}

// ============================================
// External Inspirations
// ============================================

async function fetchHackerNewsTopics(count: number = 5): Promise<string[]> {
  try {
    const res = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const ids: number[] = await res.json();
    const topIds = ids.slice(0, count);

    const stories = await Promise.all(
      topIds.map(async (id) => {
        const storyRes = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        const story = await storyRes.json();
        return story.title as string;
      })
    );

    return stories.filter(Boolean);
  } catch {
    return ["(Hacker News fetch failed — generate without external tech trends)"];
  }
}

async function fetchGitHubTrending(count: number = 5): Promise<string[]> {
  try {
    const res = await fetch(
      "https://api.github.com/search/repositories?q=created:>2026-03-16&sort=stars&order=desc&per_page=" + count,
      { headers: { "User-Agent": "zerovoids-cosmos-probe" } }
    );
    const data = await res.json();
    if (!data.items) return [];
    return data.items.map(
      (repo: { full_name: string; description: string }) =>
        `${repo.full_name}: ${(repo.description || "").slice(0, 80)}`
    );
  } catch {
    return [];
  }
}

async function fetchDevToArticles(count: number = 5): Promise<string[]> {
  try {
    const res = await fetch(
      `https://dev.to/api/articles?per_page=${count}&top=7`
    );
    const articles = await res.json();
    if (!Array.isArray(articles)) return [];
    return articles.map(
      (a: { title: string; tag_list: string[] }) =>
        `${a.title} [${(a.tag_list || []).slice(0, 3).join(", ")}]`
    );
  } catch {
    return [];
  }
}

async function fetchRedditTopics(count: number = 5): Promise<string[]> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/programming/hot.json?limit=${count}`,
      { headers: { "User-Agent": "zerovoids-cosmos-probe/1.0" } }
    );
    const data = await res.json();
    if (!data?.data?.children) return [];
    return data.data.children.map(
      (child: { data: { title: string } }) => child.data.title
    );
  } catch {
    return [];
  }
}

function generateWeeklyConstraint(): string {
  const constraints = [
    "React, Vue, Svelte 등 프론트엔드 프레임워크를 사용하지 않는 도구를 만들어라",
    "CLI 전용 도구를 만들어라 (UI 없음, 터미널에서만 동작)",
    "기존 기술 스택(TypeScript, React, D3)이 아닌 기술을 1개 이상 핵심으로 사용하라",
    "데이터 시각화가 아닌 방향의 아이디어를 만들어라",
    "게임 메카닉(점수, 레벨, 보상)을 비게임 도구에 적용하라",
    "물리적 세계의 데이터(날씨, 센서, 위치)를 활용하는 도구를 만들어라",
    "기존 인기 오픈소스 프로젝트의 빈 틈을 채우는 플러그인/확장을 만들어라",
    "교육/학습 목적의 인터랙티브 도구를 만들어라",
    "브라우저 확장 프로그램 또는 VS Code 확장을 만들어라",
    "npm 패키지로 배포할 수 있는 단일 목적 유틸리티 라이브러리를 만들어라",
    "접근성(Accessibility)을 핵심 가치로 하는 도구를 만들어라",
    "자동화/워크플로우 최적화 도구를 만들어라 (DX 개선)",
    "WebAssembly, WebGPU, 또는 최신 Web API를 활용하라",
    "테스트/디버깅/성능 분석 관련 개발자 도구를 만들어라",
    "Figma, Notion, 또는 기타 생산성 도구의 플러그인을 만들어라",
    "데이터베이스, 스키마, 마이그레이션 관련 도구를 만들어라",
  ];

  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return constraints[weekNumber % constraints.length];
}

function pickCrossDomainInspiration(): string {
  const domains = [
    "음악 이론 — 리듬 패턴, 화성학, 오디오 시각화, 음향 합성",
    "요리 — 레시피 알고리즘, 재료 대체, 영양 최적화, 풍미 조합",
    "건축 — 공간 레이아웃, 구조 패턴, 도시 설계, 동선 최적화",
    "생물학 — 진화 알고리즘, 생태계 시뮬레이션, DNA 시퀀스 패턴",
    "물리학 — 파티클 시스템, 유체 시뮬레이션, 중력 모델링",
    "언어학 — 자연어 처리, 문법 분석, 번역, 어원 분석",
    "수학 — 프랙탈, 기하학 시각화, 확률 시뮬레이션, 그래프 이론",
    "천문학 — 별 지도, 궤도 역학, 우주 탐사 데이터",
    "심리학 — 인지 편향 도구, 습관 추적, 의사결정 분석",
    "경제학 — 시장 시뮬레이션, 포트폴리오 분석, 게임 이론",
    "의학 — 건강 데이터 시각화, 증상 추적, 의료 이미지 분석",
    "농업 — 작물 성장 모델링, 토양 분석, 수확 최적화",
    "패션 — 색상 조합 생성, 스타일 추천, 트렌드 분석",
    "교통 — 경로 최적화, 교통 흐름 시뮬레이션, 대중교통 데이터",
    "고고학 — 유물 분류, 연대 측정 시각화, 발굴 지도",
    "보드게임 — 전략 엔진, 확률 계산기, 게임 밸런싱 도구",
    "사진 — 색 보정 알고리즘, 구도 분석, 메타데이터 관리",
    "기상학 — 날씨 패턴 시각화, 기후 데이터 분석",
  ];

  return domains[Math.floor(Math.random() * domains.length)];
}

async function fetchExternalInspirations(
  verbose: boolean
): Promise<ExternalInspirations> {
  if (verbose) console.log("Fetching external inspirations...");

  const [hackerNewsTopics, githubTrending, devToArticles, redditTopics] =
    await Promise.all([
      fetchHackerNewsTopics(5),
      fetchGitHubTrending(5),
      fetchDevToArticles(5),
      fetchRedditTopics(5),
    ]);

  const weeklyConstraint = generateWeeklyConstraint();
  const crossDomain = pickCrossDomainInspiration();

  if (verbose) {
    console.log(`  HN topics: ${hackerNewsTopics.length} fetched`);
    console.log(`  GitHub Trending: ${githubTrending.length} fetched`);
    console.log(`  DEV.to articles: ${devToArticles.length} fetched`);
    console.log(`  Reddit topics: ${redditTopics.length} fetched`);
    console.log(`  Weekly constraint: ${weeklyConstraint.slice(0, 60)}...`);
    console.log(`  Cross-domain: ${crossDomain.slice(0, 60)}...`);
  }

  return {
    hackerNewsTopics,
    githubTrending,
    devToArticles,
    redditTopics,
    weeklyConstraint,
    crossDomain,
  };
}

// ============================================
// Existing Ideas Loader
// ============================================

function parseFrontmatterLight(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const ci = line.indexOf(":");
    if (ci === -1) continue;
    const key = line.slice(0, ci).trim();
    const value = line.slice(ci + 1).trim().replace(/^["']|["']$/g, "");
    fm[key] = value;
  }
  return fm;
}

function parseTagsFromFrontmatter(content: string): string[] {
  const match = content.match(/^tags:\s*\[([^\]]*)\]/m);
  if (!match) return [];
  return match[1].split(",").map((t) => t.trim().replace(/["']/g, ""));
}

async function loadExistingIdeas(
  ideasDir: string,
  verbose: boolean
): Promise<ExistingIdea[]> {
  const ideas: ExistingIdea[] = [];

  try {
    const findMdFiles = async (dir: string): Promise<string[]> => {
      const results: string[] = [];
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push(...(await findMdFiles(full)));
        } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
          results.push(full);
        }
      }
      return results;
    };

    const files = await findMdFiles(ideasDir);

    for (const file of files) {
      const content = await fs.readFile(file, "utf-8");
      const fm = parseFrontmatterLight(content);
      const tags = parseTagsFromFrontmatter(content);
      const filename = path.basename(file);

      // Extract index from filename (0001-slug.md or legacy YYYY-MM-DD-slug.md)
      const indexMatch = filename.match(/^(\d{4})-/);
      let index = 0;
      if (indexMatch) {
        const parsed = parseInt(indexMatch[1], 10);
        // If > 2000 it's a year (legacy format), not an index
        index = parsed > 2000 ? 0 : parsed;
      }

      // Extract score from frontmatter
      const scoreMatch = content.match(/^\s*total:\s*([\d.]+)/m);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

      ideas.push({
        index,
        filename,
        title: fm.title || filename.replace(/\.md$/, ""),
        category: fm.category || "unknown",
        subcategory: fm.subcategory || "",
        tags,
        score,
      });
    }

    if (verbose) {
      console.log(`  Loaded ${ideas.length} existing ideas from ${ideasDir}`);
    }
  } catch {
    if (verbose) {
      console.log(`  No existing ideas found at ${ideasDir}`);
    }
  }

  return ideas;
}

function getNextIndex(existingIdeas: ExistingIdea[]): number {
  if (existingIdeas.length === 0) return 1;
  const maxIndex = Math.max(...existingIdeas.map((i) => i.index));
  // For legacy date-based files, count total files instead
  return maxIndex > 0 ? maxIndex + 1 : existingIdeas.length + 1;
}

// ============================================
// Score Distribution Analysis
// ============================================

function analyzeScoreDistribution(
  existingIdeas: ExistingIdea[]
): ScoreDistribution {
  const scores = existingIdeas.filter((i) => i.score > 0).map((i) => i.score);
  if (scores.length === 0) {
    return {
      total: 0,
      histogram: {},
      mostCommonScore: "N/A",
      mostCommonPct: 0,
      warning: null,
    };
  }

  const histogram: Record<string, number> = {};
  for (const s of scores) {
    const key = s.toFixed(1);
    histogram[key] = (histogram[key] || 0) + 1;
  }

  let mostCommonScore = "";
  let mostCommonCount = 0;
  for (const [score, count] of Object.entries(histogram)) {
    if (count > mostCommonCount) {
      mostCommonScore = score;
      mostCommonCount = count;
    }
  }

  const mostCommonPct = Math.round((mostCommonCount / scores.length) * 100);
  const warning =
    mostCommonPct > 30
      ? `WARNING: ${mostCommonPct}% of existing ideas scored exactly ${mostCommonScore}. This indicates threshold gaming. Score honestly — a bad idea should score 4-5, a great idea 8-9.`
      : null;

  return {
    total: scores.length,
    histogram,
    mostCommonScore,
    mostCommonPct,
    warning,
  };
}

// ============================================
// Prompt Builder
// ============================================

function buildExistingIdeasContext(existingIdeas: ExistingIdea[]): string {
  if (existingIdeas.length === 0) return "No existing ideas in the bank yet.";

  // Group by category
  const byCategory: Record<string, ExistingIdea[]> = {};
  for (const idea of existingIdeas) {
    const cat = idea.category || "uncategorized";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(idea);
  }

  // Find overrepresented categories
  const categoryList = Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([cat, ideas]) => `  - ${cat}: ${ideas.length}개`)
    .join("\n");

  // List all existing titles for dedup
  const titleList = existingIdeas
    .map((i) => `  - "${i.title}" [${i.tags.slice(0, 4).join(", ")}]`)
    .join("\n");

  // Find blocked concepts (3+ similar ideas)
  const titleWords: Record<string, number> = {};
  for (const idea of existingIdeas) {
    const words = idea.title
      .toLowerCase()
      .replace(/[^a-z가-힣\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    for (const w of words) {
      titleWords[w] = (titleWords[w] || 0) + 1;
    }
  }
  const overusedConcepts = Object.entries(titleWords)
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => `  - "${word}" (${count}회 사용됨 — AVOID)`)
    .join("\n");

  return `## Existing Ideas in Bank (${existingIdeas.length}개)

### Category Distribution
${categoryList}

### Overused Concepts (MUST AVOID)
${overusedConcepts || "  (none)"}

### All Existing Titles (DO NOT duplicate these)
${titleList}

### DEDUPLICATION RULES
- Your idea MUST be fundamentally different from ALL titles listed above
- If your idea shares the same core concept as ANY existing idea, it is a DUPLICATE
- "Same concept with slightly different framing" = DUPLICATE
- "Same tech stack solving same problem" = DUPLICATE
- Category with 3+ ideas: AVOID unless your angle is radically different`;
}

function buildExternalContext(
  inspirations: ExternalInspirations,
  scoreDist: ScoreDistribution
): string {
  const hnSection =
    inspirations.hackerNewsTopics.length > 0
      ? `### Hacker News Top Stories
${inspirations.hackerNewsTopics.map((t) => `  - ${t}`).join("\n")}`
      : "";

  const ghSection =
    inspirations.githubTrending.length > 0
      ? `### GitHub Trending Repos
${inspirations.githubTrending.map((t) => `  - ${t}`).join("\n")}`
      : "";

  const devToSection =
    inspirations.devToArticles.length > 0
      ? `### DEV.to Popular Articles
${inspirations.devToArticles.map((t) => `  - ${t}`).join("\n")}`
      : "";

  const redditSection =
    inspirations.redditTopics.length > 0
      ? `### Reddit r/programming Hot Topics
${inspirations.redditTopics.map((t) => `  - ${t}`).join("\n")}`
      : "";

  const scoreWarning = scoreDist.warning
    ? `\n### Score Distribution Warning\n${scoreDist.warning}\n`
    : "";

  return `## External Context

### Weekly Constraint (MUST follow)
${inspirations.weeklyConstraint}

### Cross-Domain Inspiration (incorporate if possible)
${inspirations.crossDomain}

### Real-Time Tech Trends (use as inspiration seeds)
${[hnSection, ghSection, devToSection, redditSection].filter(Boolean).join("\n\n")}
${scoreWarning}`;
}

function buildSystemPrompt(
  docs: AgentDocuments,
  existingIdeasContext: string,
  externalContext: string,
  nextIndex: number
): string {
  return `You are the idea-generator-critic probe.

Your mission is to generate a high-quality, UNIQUE project idea that does NOT duplicate any existing ideas.

## Your Reference Documents

### Agent Definition (How you operate)
${docs.agentDefinition}

### User Context (Who you're generating for)
${docs.context}

### Evaluation Criteria (How to score — 8 dimensions including distinctness)
${docs.evaluationCriteria}

### Refinement Protocol (How to improve failing ideas)
${docs.refinementProtocol}

### Frontmatter Specification (Metadata format)
${docs.frontmatterSpec}

### Output Template (Final document format)
${docs.outputTemplate}

${existingIdeasContext}

${externalContext}

## Instructions

Follow this execution flow:
1. Review existing ideas — understand what's already been generated
2. Consider external inspirations and weekly constraint
3. Generate an idea that is FUNDAMENTALLY DIFFERENT from all existing ideas
4. Evaluate it using ALL 8 dimensions (including distinctness)
5. If it fails, refine (max 3 iterations). If fails due to low distinctness: generate completely new concept
6. Format the final output

## Output Format

Your response must be valid JSON with this structure:

\`\`\`json
{
  "status": "pass" | "fail",
  "score": <number>,
  "iterations": <number>,
  "title": "<idea title>",
  "slug": "<url-friendly-slug>",
  "evaluation": {
    "originality": <1-10>,
    "feasibility": <1-10>,
    "market_need": <1-10>,
    "monetization_potential": <1-10>,
    "tech_interest": <1-10>,
    "learning_value": <1-10>,
    "open_source_value": <1-10>,
    "distinctness": <1-10>
  },
  "refinement_log": [
    {
      "iteration": <number>,
      "weakness": "<dimension>",
      "strategy": "<applied strategy>",
      "change": "<what changed>"
    }
  ],
  "content": "<full markdown content with frontmatter>"
}
\`\`\`

IMPORTANT:
- The "content" field must contain the COMPLETE Markdown document following the output template
- In the frontmatter, use id: "idea-${String(nextIndex).padStart(4, "0")}" and generated: "${new Date().toISOString()}"
- Be creative and don't settle for generic ideas
- Be honest in evaluation - don't inflate scores
- Score distinctness HONESTLY — if it's similar to existing ideas, score it LOW
- **CRITICAL: Write ALL content in Korean (한국어)** - including title, descriptions, problem, solution, all sections. Only keep technical terms, code, and YAML keys in English.`;
}

// ============================================
// JSON Extraction
// ============================================

function extractJson(text: string): string {
  // Strategy 1: ```json ... ``` code fence
  const fenceStart = text.indexOf("```json");
  const fenceEnd = text.lastIndexOf("```");
  if (fenceStart !== -1 && fenceEnd > fenceStart) {
    return text.slice(fenceStart + 7, fenceEnd).trim();
  }

  // Strategy 2: brace-depth counting to find the first complete top-level JSON object
  // This correctly handles nested braces inside string values (e.g. markdown in "content")
  const firstBrace = text.indexOf("{");
  if (firstBrace !== -1) {
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = firstBrace; i < text.length; i++) {
      const ch = text[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        escaped = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          return text.slice(firstBrace, i + 1);
        }
      }
    }
  }

  // Fallback: return as-is, let caller handle parse error
  return text.trim();
}

// ============================================
// Post-processing
// ============================================

function postProcessContent(
  content: string,
  nextIndex: number
): string {
  const now = new Date();
  const id = `idea-${String(nextIndex).padStart(4, "0")}`;
  const generated = now.toISOString();

  // Override any hardcoded ID
  let result = content.replace(
    /^id:\s*.+$/m,
    `id: ${id}`
  );

  // Override any hardcoded timestamp
  result = result.replace(
    /^generated:\s*.+$/m,
    `generated: ${generated}`
  );

  return result;
}

// ============================================
// API Client
// ============================================

async function generateIdea(
  client: Anthropic,
  docs: AgentDocuments,
  existingIdeasContext: string,
  externalContext: string,
  nextIndex: number
): Promise<GenerationResult> {
  const systemPrompt = buildSystemPrompt(
    docs,
    existingIdeasContext,
    externalContext,
    nextIndex
  );

  const response = await client.messages.create({
    model: CONFIG.model,
    max_tokens: CONFIG.maxTokens,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content:
          "Generate a project idea for me. It MUST be different from all existing ideas. Follow your agent definition and return the result as JSON.",
      },
    ],
  });

  // Extract text content
  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  // Parse JSON from response — try multiple extraction strategies
  const jsonStr = extractJson(textContent.text);

  try {
    const result = JSON.parse(jsonStr);

    // Post-process: force correct ID and timestamp
    const processedContent = postProcessContent(
      result.content,
      nextIndex
    );

    return {
      status: result.status,
      score: result.score,
      iterations: result.iterations,
      filename: generateFilename(nextIndex, result.slug),
      content: processedContent,
      title: result.title,
    };
  } catch {
    // Log a truncated preview so CI can diagnose without flooding logs
    const preview = textContent.text.slice(0, 500);
    throw new Error(`Failed to parse response as JSON.\nExtracted fragment:\n${jsonStr.slice(0, 300)}\n\nRaw response preview:\n${preview}`);
  }
}

// ============================================
// File Operations
// ============================================

function generateFilename(index: number, slug: string): string {
  const paddedIndex = String(index).padStart(4, "0");
  const safeSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  return `${paddedIndex}-${safeSlug}.md`;
}

async function saveResult(
  result: GenerationResult,
  outputDir: string
): Promise<string> {
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, result.filename);
  await fs.writeFile(outputPath, result.content, "utf-8");
  return outputPath;
}

// ============================================
// CLI
// ============================================

interface CliOptions {
  output?: string;
  ideasDir?: string;
  dryRun?: boolean;
  verbose?: boolean;
  json?: boolean;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--output":
      case "-o":
        options.output = args[++i];
        break;
      case "--ideas-dir":
        options.ideasDir = args[++i];
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      case "--json":
        options.json = true;
        break;
    }
  }

  return options;
}

function printUsage(): void {
  console.log(`
Usage: pnpm run probe:idea-generator-critic [options]

Options:
  -o, --output <dir>      Output directory (default: ./output)
  --ideas-dir <dir>       Existing ideas directory for dedup check
  --dry-run               Generate but don't save
  -v, --verbose           Show detailed output
  --json                  Output result as JSON (for CI)

Examples:
  pnpm run probe:idea-generator-critic
  pnpm run probe:idea-generator-critic --ideas-dir ../zerovoids-idea-bank/ideas
  pnpm run probe:idea-generator-critic --dry-run --verbose
  pnpm run probe:idea-generator-critic --json --ideas-dir ../zerovoids-idea-bank/ideas
`);
}

// ============================================
// Main
// ============================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const options = parseArgs(args);
  const agentDir = path.dirname(fileURLToPath(import.meta.url));
  const outputDir = options.output ?? CONFIG.outputDir;
  const verbose = options.verbose ?? false;

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY environment variable not set");
    process.exit(1);
  }

  const client = new Anthropic();

  try {
    // 1. Load agent documents
    if (verbose) console.log("Loading agent documents...");
    const docs = await loadDocuments(agentDir);

    // 2. Fetch external inspirations
    const inspirations = await fetchExternalInspirations(verbose);

    // 3. Load existing ideas (for dedup)
    let existingIdeas: ExistingIdea[] = [];
    if (options.ideasDir) {
      if (verbose) console.log("Loading existing ideas...");
      existingIdeas = await loadExistingIdeas(options.ideasDir, verbose);
    }

    // 4. Analyze score distribution
    const scoreDist = analyzeScoreDistribution(existingIdeas);
    if (verbose && scoreDist.warning) {
      console.log(`  ${scoreDist.warning}`);
    }

    // 5. Determine next index
    const nextIndex = getNextIndex(existingIdeas);
    if (verbose) console.log(`  Next index: ${String(nextIndex).padStart(4, "0")}`);

    // 6. Build context strings
    const existingIdeasContext = buildExistingIdeasContext(existingIdeas);
    const externalContext = buildExternalContext(inspirations, scoreDist);

    // 7. Generate idea
    if (verbose) console.log("Generating idea...");
    const result = await generateIdea(
      client,
      docs,
      existingIdeasContext,
      externalContext,
      nextIndex
    );

    // 8. Output result
    if (options.json) {
      console.log(JSON.stringify(result));
      return;
    }

    // Display result
    const statusLabel = result.status === "pass" ? "PASS" : "FAIL";
    console.log(`\n[${statusLabel}] ${result.title}`);
    console.log(`   Score: ${result.score.toFixed(2)}`);
    console.log(`   Iterations: ${result.iterations}`);
    console.log(`   File: ${result.filename}`);

    // Save if not dry run
    if (!options.dryRun) {
      const outputPath = await saveResult(result, outputDir);
      console.log(`   Saved to: ${outputPath}`);
    } else {
      console.log("   Dry run - not saved");
      if (verbose) {
        console.log("\n--- Content Preview ---");
        console.log(result.content.slice(0, 500) + "...");
      }
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

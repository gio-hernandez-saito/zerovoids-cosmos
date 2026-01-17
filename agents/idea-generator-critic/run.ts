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
  model: "claude-sonnet-4-20250514",
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
// Prompt Builder
// ============================================

function buildSystemPrompt(docs: AgentDocuments): string {
  return `You are the idea-generator-critic agent.

Your mission is to generate a high-quality, original project idea based on the user context provided.

## Your Reference Documents

### Agent Definition (How you operate)
${docs.agentDefinition}

### User Context (Who you're generating for)
${docs.context}

### Evaluation Criteria (How to score)
${docs.evaluationCriteria}

### Refinement Protocol (How to improve failing ideas)
${docs.refinementProtocol}

### Frontmatter Specification (Metadata format)
${docs.frontmatterSpec}

### Output Template (Final document format)
${docs.outputTemplate}

## Instructions

Follow the execution flow in your agent definition:
1. Generate an idea based on user context
2. Evaluate it using the 7 dimensions
3. If it fails, refine (max 3 iterations)
4. Format the final output

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
    "open_source_value": <1-10>
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
- Include valid YAML frontmatter at the start
- Be creative and don't settle for generic ideas
- Be honest in evaluation - don't inflate scores
- **CRITICAL: Write ALL content in Korean (한국어)** - including title, descriptions, problem, solution, all sections. Only keep technical terms, code, and YAML keys in English.`;
}

// ============================================
// API Client
// ============================================

async function generateIdea(
  client: Anthropic,
  docs: AgentDocuments
): Promise<GenerationResult> {
  const systemPrompt = buildSystemPrompt(docs);

  const response = await client.messages.create({
    model: CONFIG.model,
    max_tokens: CONFIG.maxTokens,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content:
          "Generate a project idea for me. Follow your agent definition and return the result as JSON.",
      },
    ],
  });

  // Extract text content
  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  // Parse JSON from response
  // Handle case where content contains Markdown code blocks
  let jsonStr = textContent.text;
  
  // Find first ```json and last ```
  const jsonStart = textContent.text.indexOf("```json");
  const jsonEnd = textContent.text.lastIndexOf("```");
  
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    jsonStr = textContent.text.slice(jsonStart + 7, jsonEnd).trim();
  }

  try {
    const result = JSON.parse(jsonStr);
    return {
      status: result.status,
      score: result.score,
      iterations: result.iterations,
      filename: generateFilename(result.slug),
      content: result.content,
      title: result.title,
    };
  } catch {
    throw new Error(`Failed to parse response as JSON: ${textContent.text}`);
  }
}

// ============================================
// File Operations
// ============================================

function generateFilename(slug: string): string {
  const date = new Date().toISOString().split("T")[0];
  const safeSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  return `${date}-${safeSlug}.md`;
}

async function saveResult(
  result: GenerationResult,
  outputDir: string
): Promise<string> {
  // Create YYYY/MM folder structure
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const fullOutputDir = path.join(outputDir, year, month);
  
  await fs.mkdir(fullOutputDir, { recursive: true });
  const outputPath = path.join(fullOutputDir, result.filename);
  await fs.writeFile(outputPath, result.content, "utf-8");
  return outputPath;
}

// ============================================
// CLI
// ============================================

interface CliOptions {
  output?: string;
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
Usage: npx tsx run.ts [options]

Options:
  -o, --output <dir>   Output directory (default: ./output)
  --dry-run            Generate but don't save
  -v, --verbose        Show detailed output
  --json               Output result as JSON (for CI)

Examples:
  npx tsx run.ts
  npx tsx run.ts --output ../../../ideas/
  npx tsx run.ts --dry-run --verbose
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

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY environment variable not set");
    process.exit(1);
  }

  const client = new Anthropic();

  try {
    // Load documents
    if (options.verbose) {
      console.log("📚 Loading agent documents...");
    }
    const docs = await loadDocuments(agentDir);

    // Generate idea
    if (options.verbose) {
      console.log("💡 Generating idea...");
    }
    const result = await generateIdea(client, docs);

    // Output result
    if (options.json) {
      console.log(JSON.stringify(result));
      return;
    }

    // Display result
    const emoji = result.status === "pass" ? "✅" : "❌";
    console.log(`\n${emoji} ${result.title}`);
    console.log(`   Score: ${result.score.toFixed(2)}`);
    console.log(`   Iterations: ${result.iterations}`);
    console.log(`   Status: ${result.status.toUpperCase()}`);

    // Save if not dry run
    if (!options.dryRun) {
      const outputPath = await saveResult(result, outputDir);
      console.log(`\n📁 Saved to: ${outputPath}`);
    } else {
      console.log("\n🔍 Dry run - not saved");
      if (options.verbose) {
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

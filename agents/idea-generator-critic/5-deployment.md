# Deployment

> Defines how to run the agent and automate idea generation

---

## 🎯 Overview

This document covers:

- Local development and testing
- GitHub Actions automation
- Repository structure
- Output management

---

## 📁 Repository Structure

### Idea Bank Repository

```
zerovoids-idea-bank/
├── .github/
│   └── workflows/
│       └── daily-idea.yml
├── ideas/
│   └── 2026/
│       └── 01/
│           ├── 2026-01-15-metroidvania-code-explorer.md
│           └── 2026-01-16-baseball-pitch-analyzer.md
├── archive/
│   └── failed/
│       └── 2026-01-14-generic-todo-app.md
├── stats/
│   ├── monthly-2026-01.json
│   └── all-time.json
└── README.md
```

### Directory Purposes

| Directory         | Purpose      | Contents                                  |
|-------------------|--------------|-------------------------------------------|
| `ideas/YYYY/MM/`  | Passed ideas | Ideas that met criteria                   |
| `archive/failed/` | Failed ideas | Ideas that couldn't pass after refinement |
| `stats/`          | Analytics    | Monthly and cumulative statistics         |

### File Naming Convention

```
YYYY-MM-DD-slug-title.md
```

Examples:
- `2026-01-15-metroidvania-code-explorer.md`
- `2026-01-16-baseball-pitch-analyzer.md`
- `2026-01-17-3d-file-navigator.md`

---

## 🖥️ Local Development

### Prerequisites

- Node.js 20+
- pnpm
- Anthropic API key

### Setup

```bash
# Clone subagents repo
git clone https://github.com/zerovoids/zerovoids-subagents.git
cd zerovoids-subagents

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
```

### Manual Execution

```bash
# Run idea generator
pnpm run agent:idea-generator-critic

# With options
pnpm run agent:idea-generator-critic --output ./output/
pnpm run agent:idea-generator-critic --dry-run
pnpm run agent:idea-generator-critic --verbose
```

### Testing

```bash
# Test evaluation logic
pnpm test agents/idea-generator-critic

# Test with mock data
pnpm test:mock agents/idea-generator-critic
```

---

## ⚙️ GitHub Actions

### Workflow File

```yaml
# .github/workflows/daily-idea.yml

name: Daily Idea Generation

on:
  schedule:
    # Run at 9 AM KST (0 AM UTC) every day
    - cron: '0 0 * * *'
  workflow_dispatch:
    # Allow manual trigger
    inputs:
      force_publish:
        description: 'Publish even if score below threshold'
        required: false
        default: 'false'
        type: boolean

env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

jobs:
  generate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout subagents
        uses: actions/checkout@v4
        with:
          repository: zerovoids/zerovoids-subagents
          path: subagents

      - name: Checkout idea-bank
        uses: actions/checkout@v4
        with:
          repository: zerovoids/zerovoids-idea-bank
          path: idea-bank
          token: ${{ secrets.IDEA_BANK_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: |
          cd subagents
          pnpm install

      - name: Generate idea
        id: generate
        run: |
          cd subagents
          RESULT=$(pnpm run agent:idea-generator-critic --json)
          echo "result=$RESULT" >> $GITHUB_OUTPUT

      - name: Process result
        run: |
          cd idea-bank
          
          DATE=$(date +%Y-%m-%d)
          YEAR=$(date +%Y)
          MONTH=$(date +%m)
          
          # Parse result
          STATUS=$(echo '${{ steps.generate.outputs.result }}' | jq -r '.status')
          SCORE=$(echo '${{ steps.generate.outputs.result }}' | jq -r '.score')
          FILENAME=$(echo '${{ steps.generate.outputs.result }}' | jq -r '.filename')
          
          # Route based on status
          if [ "$STATUS" = "pass" ]; then
            mkdir -p "ideas/$YEAR/$MONTH"
            cp "../subagents/output/$FILENAME" "ideas/$YEAR/$MONTH/"
            echo "✅ Idea passed with score $SCORE"
          else
            mkdir -p "archive/failed"
            cp "../subagents/output/$FILENAME" "archive/failed/"
            echo "❌ Idea failed with score $SCORE"
          fi

      - name: Update stats
        run: |
          cd idea-bank
          node scripts/update-stats.js

      - name: Commit and push
        run: |
          cd idea-bank
          git config user.name "Idea Generator Bot"
          git config user.email "bot@zerovoids.dev"
          git add .
          git diff --staged --quiet || git commit -m "feat: daily idea $(date +%Y-%m-%d)"
          git push
```

### Required Secrets

| Secret              | Purpose                       |
|---------------------|-------------------------------|
| `ANTHROPIC_API_KEY` | API access for Claude         |
| `IDEA_BANK_TOKEN`   | Push access to idea-bank repo |

### Setting Up Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Add `ANTHROPIC_API_KEY` with your Anthropic API key
3. Create a Personal Access Token with `repo` scope
4. Add `IDEA_BANK_TOKEN` with the PAT

---

## 📊 Stats Generation

### Monthly Stats

```json
{
  "month": "2026-01",
  "generated": 31,
  "passed": 22,
  "failed": 9,
  "pass_rate": 0.71,
  "avg_score": 7.2,
  "avg_iterations": 1.8,
  "by_category": {
    "frontend": 8,
    "automation": 6,
    "visualization": 5,
    "tool": 3
  },
  "top_scores": [
    { "title": "Metroidvania Code Explorer", "score": 8.9 },
    { "title": "Baseball Analytics Dashboard", "score": 8.2 }
  ]
}
```

### All-Time Stats

```json
{
  "total_generated": 156,
  "total_passed": 112,
  "total_failed": 44,
  "overall_pass_rate": 0.72,
  "overall_avg_score": 7.3,
  "monthly_trend": [
    { "month": "2026-01", "passed": 22, "avg_score": 7.2 },
    { "month": "2026-02", "passed": 25, "avg_score": 7.4 }
  ],
  "best_ideas": [
    { "title": "...", "score": 9.2, "date": "2026-01-15" }
  ]
}
```

### Stats Update Script

```javascript
// scripts/update-stats.js

const fs = require('fs');
const path = require('path');

function updateStats() {
  const ideasDir = path.join(__dirname, '../ideas');
  const statsDir = path.join(__dirname, '../stats');
  
  // Gather all ideas
  const ideas = gatherIdeas(ideasDir);
  
  // Calculate monthly stats
  const monthlyStats = calculateMonthlyStats(ideas);
  
  // Calculate all-time stats
  const allTimeStats = calculateAllTimeStats(ideas);
  
  // Write stats files
  for (const [month, stats] of Object.entries(monthlyStats)) {
    fs.writeFileSync(
      path.join(statsDir, `monthly-${month}.json`),
      JSON.stringify(stats, null, 2)
    );
  }
  
  fs.writeFileSync(
    path.join(statsDir, 'all-time.json'),
    JSON.stringify(allTimeStats, null, 2)
  );
}

updateStats();
```

---

## 🔔 Notifications (Optional)

### Discord Webhook

```yaml
# Add to workflow after commit step

- name: Notify Discord
  if: success()
  run: |
    STATUS=$(echo '${{ steps.generate.outputs.result }}' | jq -r '.status')
    TITLE=$(echo '${{ steps.generate.outputs.result }}' | jq -r '.title')
    SCORE=$(echo '${{ steps.generate.outputs.result }}' | jq -r '.score')
    
    if [ "$STATUS" = "pass" ]; then
      EMOJI="✅"
      COLOR="3066993"
    else
      EMOJI="❌"
      COLOR="15158332"
    fi
    
    curl -H "Content-Type: application/json" \
      -d "{\"embeds\": [{\"title\": \"$EMOJI Daily Idea: $TITLE\", \"description\": \"Score: $SCORE\", \"color\": $COLOR}]}" \
      ${{ secrets.DISCORD_WEBHOOK }}
```

### Slack Notification

```yaml
- name: Notify Slack
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Daily idea generated: ${{ steps.generate.outputs.result }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🛠️ Maintenance

### Manual Operations

```bash
# Regenerate all stats
pnpm run stats:rebuild

# Validate all idea files
pnpm run validate:ideas

# Clean up malformed files
pnpm run cleanup
```

### Troubleshooting

| Issue                   | Cause             | Solution                     |
|-------------------------|-------------------|------------------------------|
| Workflow not triggering | Cron syntax       | Check timezone (UTC)         |
| API rate limit          | Too many requests | Add delay between calls      |
| Push failed             | Token expired     | Regenerate PAT               |
| Low quality output      | Context missing   | Check 0-context.md is loaded |

### Monitoring

- Check Actions tab for workflow runs
- Review failed runs for errors
- Monitor API usage in Anthropic console
- Track pass rate trends in stats

---

## 🚀 Deployment Checklist

### Initial Setup

- [ ] Create `zerovoids-idea-bank` repository
- [ ] Set up directory structure
- [ ] Add workflow file
- [ ] Configure secrets
- [ ] Test manual trigger
- [ ] Verify cron schedule

### Ongoing

- [ ] Monitor daily runs
- [ ] Review generated ideas weekly
- [ ] Adjust thresholds if needed
- [ ] Update context as interests change

---

## 🔗 Related Documents

- `agent.md`: The actual agent implementation
- `0-context.md`: Context loaded during generation
- `3-evaluation-criteria.md`: Scoring that determines pass/fail
- `4-refinement-protocol.md`: How failed ideas are refined

---

**Last Updated**: 2026-01-16

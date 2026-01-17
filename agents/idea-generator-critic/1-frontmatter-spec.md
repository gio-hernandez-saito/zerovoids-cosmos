# Frontmatter Specification

> Defines the YAML frontmatter structure for generated idea documents

---

## 📋 Complete Structure

```yaml
---
# Identification
id: idea-{YYYY-MM-DD}-{NNN}
title: "{Concise, descriptive title}"
generated: {ISO 8601 timestamp with timezone}

# Classification
category: {primary category}
subcategory: {optional, specific niche}
difficulty: {skill level required}
tags: [{relevant, searchable, keywords}]

# Technical Stack
estimated_time: {human-readable duration}
tech_stack: [{primary technologies}]
languages: [{programming languages}]

# Evaluation Scores (1-10)
evaluation:
  originality: {N}              # How unique/novel
  feasibility: {N}              # How buildable
  market_need: {N}              # Problem severity
  monetization_potential: {N}   # Revenue possibility
  tech_interest: {N}            # Technical intrigue
  learning_value: {N}           # Personal growth potential
  open_source_value: {N}        # Community benefit
  
  total: {N.N}                  # Weighted average
  iterations: {N}               # Refinement rounds
  status: pass | fail           # Final result

# Optional Context
related_projects: [{existing projects}]
inspiration_source: {where idea came from}
---
```

---

## 🔍 Field Definitions

### Identification

#### `id`
```yaml
format: "idea-YYYY-MM-DD-NNN"
example: "idea-2026-01-15-001"

rules:
  - YYYY-MM-DD: Generation date
  - NNN: Sequential number (001, 002, ...)
  - Unique per day
  - Zero-padded to 3 digits
```

#### `title`
```yaml
format: "Short, Descriptive Title"
example: "Monorepo Insight Engine"

rules:
  - 3-8 words
  - Title case
  - No generic terms (app, tool, system)
  - Specific and evocative
  - No version numbers or dates

good:
  - "Baseball Stats Visualizer"
  - "MCP Workflow Automator"
  - "Color Space Converter"

bad:
  - "New App" (too generic)
  - "Tool for Developers" (vague)
  - "My Project v1" (version in title)
```

#### `generated`
```yaml
format: ISO 8601 with timezone
example: "2026-01-15T09:30:00+09:00"

rules:
  - Full timestamp
  - Include timezone offset
  - UTC or local timezone acceptable
```

---

### Classification

#### `category`
```yaml
options:
  - automation       # Workflow, CLI, scripts
  - visualization    # Data viz, graphics, 3D
  - frontend         # UI, components, frameworks
  - developer-tool   # Dev productivity
  - data             # Data processing, analysis
  - gaming           # Game-related, interactive
  - creative         # Art, music, generative
  - experimental     # R&D, proof-of-concept
  - infrastructure   # Build, deploy, architecture
  - learning         # Educational, tutorials
  - utility          # General purpose tools
  - entertainment    # Fun, leisure apps

rules:
  - Pick ONE primary category
  - Most specific applicable
  - Use subcategory for nuance
```

#### `subcategory` (optional)
```yaml
examples:
  - category: visualization
    subcategory: baseball-analytics
  
  - category: automation
    subcategory: mcp-server
  
  - category: frontend
    subcategory: react-native

rules:
  - More specific than category
  - 1-3 words, hyphenated
  - Only when truly distinct
```

#### `difficulty`
```yaml
levels:
  beginner:
    - Simple logic, basic APIs
    - Minimal architecture decisions
    - 1-2 days for experienced dev
    - Examples: CLI tool, data formatter
  
  intermediate:
    - Moderate complexity
    - Some architectural planning
    - Multiple components/modules
    - 1-2 weeks for experienced dev
    - Examples: Data viz dashboard, MCP server
  
  advanced:
    - Complex architecture
    - Performance considerations
    - Multiple technologies integration
    - 2-4 weeks for experienced dev
    - Examples: Real-time multiplayer, 3D engine
  
  expert:
    - Research-level problems
    - Novel algorithms/approaches
    - Deep technical expertise required
    - 4+ weeks even for experts
    - Examples: New rendering technique, compiler optimization

rules:
  - Based on implementation, not idea
  - Consider for solo developer
  - Account for learning curve
```

#### `tags`
```yaml
format: array of lowercase, hyphenated strings
example: [react, data-viz, baseball, d3, typescript]

guidelines:
  - 3-7 tags
  - Specific technologies (react, vue, d3)
  - Domains (baseball, movies, gaming)
  - Techniques (automation, visualization)
  - Use cases (productivity, entertainment)

good:
  - [metroidvania, game-mechanics, react]
  - [mcp, automation, cli, typescript]
  - [color-theory, accessibility, design-system]

bad:
  - "[cool, awesome, great]" # subjective
  - "[javascript]" # too broad if using react
  - "15 tags" # too many
```

---

### Technical Stack

#### `estimated_time`
```yaml
format: "{N} {unit}" or "{N-M} {unit}"
examples:
  - "2-3 days"
  - "1 week"
  - "2-3 weeks"
  - "1 month"

rules:
  - For MVP, not polished product
  - Assume experienced developer
  - Include learning curve if new tech
  - Be realistic, not optimistic

ranges:
  - Days: Small utilities, simple tools
  - 1-2 weeks: Standard projects
  - 2-4 weeks: Complex applications
  - 1+ month: Mark as "expert" difficulty
```

#### `tech_stack`
```yaml
format: array of primary technologies
example: [React, TypeScript, D3.js, Vite]

guidelines:
  - List 3-6 key technologies
  - Frameworks, libraries, major tools
  - Specific versions if critical
  - Most important first

categories:
  - Frontend: React, Vue, Svelte
  - Visualization: D3.js, Three.js
  - Backend: Node.js, Python
  - Build: Vite, Webpack, Turbopack
  - Testing: Vitest, Playwright
  - Styling: Tailwind, CSS Modules

good:
  - [React Native, TypeScript, MCP]
  - [Vue 3, D3.js, Vitest]
  - [Svelte, Three.js, WebGL]

avoid:
  - Too generic: [JavaScript, HTML, CSS]
  - Too many: [15 different libraries]
  - Obvious: [Git, VS Code] (assumed)
```

#### `languages`
```yaml
format: array of programming languages
example: [TypeScript, Python, CSS]

rules:
  - Programming languages only
  - 1-3 languages typically
  - Order by prominence in project

common:
  - TypeScript (preferred)
  - JavaScript
  - Python (automation)
  - CSS/SCSS (if significant styling)
```

---

### Evaluation Scores

All scores are **1-10 scale**, where:
- 1-3: Poor/Low
- 4-6: Fair/Medium
- 7-8: Good/High
- 9-10: Excellent/Outstanding

#### `originality` (1-10)
```yaml
measures: How unique or novel is this idea?

high_score (8-10):
  - New approach to known problem
  - Unexpected combination of technologies
  - Fresh perspective on domain
  - Haven't seen similar projects

medium_score (5-7):
  - Some novel aspects
  - Familiar concept, different execution
  - Incremental improvement on existing

low_score (1-4):
  - Very common project type
  - Many similar implementations exist
  - Generic "another X app"

examples:
  - 9: Metroidvania-inspired code explorer
  - 6: Baseball stats dashboard (common but specific)
  - 3: Todo list app (saturated)
```

#### `feasibility` (1-10)
```yaml
measures: How realistic to build in estimated time?

high_score (8-10):
  - Clear technical path
  - Existing libraries/tools available
  - No major unknowns
  - Achievable in 1-3 weeks

medium_score (5-7):
  - Some technical challenges
  - May need research
  - 3-6 weeks realistic
  - Possible blockers identified

low_score (1-4):
  - Major technical hurdles
  - Requires deep R&D
  - Uncertain if possible
  - 2+ months minimum

factors:
  - Available libraries/APIs
  - Technical complexity
  - Learning curve
  - Time constraints
```

#### `market_need` (1-10)
```yaml
measures: How severe is the problem this solves?

high_score (8-10):
  - Frequent, painful problem
  - Affects many people
  - Current solutions inadequate
  - Daily friction point

medium_score (5-7):
  - Occasional annoyance
  - Niche but real problem
  - Workarounds exist
  - Quality-of-life improvement

low_score (1-4):
  - Rare problem
  - Easy workarounds
  - "Nice to have" only
  - Self-created problem

examples:
  - 9: Automate repetitive dev task
  - 6: Better visualization for specific domain
  - 3: Slightly prettier alternative to existing tool
```

#### `monetization_potential` (1-10)
```yaml
measures: Could this generate revenue?

high_score (8-10):
  - Clear business model
  - People pay for similar tools
  - B2B potential
  - Subscription/license viable

medium_score (5-7):
  - Possible sponsorship
  - Freemium model
  - Tips/donations
  - Indirect monetization

low_score (1-4):
  - Pure open source
  - No clear revenue path
  - Commodity product
  - Free alternatives abundant

note: Low score is fine! Not all projects need revenue.
```

#### `tech_interest` (1-10)
```yaml
measures: How technically engaging/educational?

high_score (8-10):
  - Novel technical challenge
  - Learn new skills
  - Interesting algorithms
  - Creative problem-solving

medium_score (5-7):
  - Some new techniques
  - Solidify existing skills
  - Standard challenges
  - Moderate complexity

low_score (1-4):
  - Routine implementation
  - No new learning
  - Repetitive patterns
  - Trivial technically

factors:
  - Novelty of approach
  - Learning opportunities
  - Technical depth
  - Creative problem-solving
```

#### `learning_value` (1-10)
```yaml
measures: How much will I grow from building this?

high_score (8-10):
  - Opens new domain knowledge
  - Forces deep understanding
  - Skills transfer to future projects
  - Paradigm-shifting learning

medium_score (5-7):
  - Solidifies important concepts
  - Introduces new techniques
  - Practical skills gained
  - Moderate stretch required

low_score (1-4):
  - Already know how to do this
  - Repetitive patterns
  - Minimal new learning
  - Comfort zone only

factors:
  - Conceptual depth
  - New territory explored
  - Transferable insights
  - Growth potential
```

#### `open_source_value` (1-10)
```yaml
measures: How beneficial to community?

high_score (8-10):
  - Fills clear gap
  - Reusable by others
  - Solves common problem
  - Good documentation potential

medium_score (5-7):
  - Niche but useful
  - Some reusability
  - Educational value
  - Specific use case

low_score (1-4):
  - Very personal/specific
  - Hard to generalize
  - Limited audience
  - Difficult to document

factors:
  - Reusability
  - Community need
  - Documentation effort
  - Maintenance burden
```

---

### Evaluation Metadata

#### `total`
```yaml
format: N.N (one decimal)
calculation: Weighted average of 7 scores

weights:
  originality: 15%
  feasibility: 20%
  market_need: 15%
  monetization_potential: 10%
  tech_interest: 15%
  portfolio_value: 15%
  open_source_value: 10%

formula:
  total = (
    originality * 0.15 +
    feasibility * 0.20 +
    market_need * 0.15 +
    monetization_potential * 0.10 +
    tech_interest * 0.15 +
    portfolio_value * 0.15 +
    open_source_value * 0.10
  )

example:
  scores: [8, 7, 6, 5, 9, 8, 7]
  total: 7.25
```

#### `iterations`
```yaml
format: integer (1-3)
meaning: How many refinement rounds before passing

values:
  1: Passed on first try
  2: Refined once
  3: Refined twice (maximum attempts)

note: If still fails after 3 iterations, status = fail
```

#### `status`
```yaml
options: pass | fail

pass:
  - Meets quality criteria
  - See 3-evaluation-criteria.md for rules
  - Will be saved to repository

fail:
  - Did not meet criteria after 3 iterations
  - Logged but not published
  - Stored in archive/failed-attempts/
```

---

### Optional Context

#### `related_projects`
```yaml
format: array of project names/repos
example: [heritage, zerovoids-subagents]

use_when:
  - Builds on existing project
  - Complements other work
  - Part of larger ecosystem

rules:
  - 0-3 related projects
  - Brief names only
  - Can be external projects
```

#### `inspiration_source`
```yaml
format: short string describing origin
examples:
  - "GitHub Trending - React"
  - "Personal pain point - monorepo management"
  - "Baseball game + data viz mashup"
  - "Metroidvania mechanics → code exploration"

use_when:
  - Clear inspiration source
  - Helps explain context
  - Attribution needed

rules:
  - One line max
  - Specific not vague
  - Optional field
```

---

## ✅ Validation Rules

### Required Fields
```yaml
must_have:
  - id
  - title
  - generated
  - category
  - difficulty
  - tags (at least 3)
  - estimated_time
  - tech_stack (at least 2)
  - languages (at least 1)
  - All 7 evaluation scores
  - total
  - iterations
  - status
```

### Data Types
```yaml
string: id, title, category, subcategory, difficulty, estimated_time, inspiration_source
datetime: generated
array: tags, tech_stack, languages, related_projects
number: all evaluation scores (1-10)
decimal: total (N.N)
integer: iterations (1-3)
enum: status (pass | fail)
```

### Constraints
```yaml
title: 100 characters max
tags: 3-7 items
tech_stack: 2-8 items
languages: 1-4 items
evaluation_scores: must be 1-10 (integers)
total: must be 1.0-10.0 (one decimal)
iterations: must be 1-3
```

---

## 📝 Complete Examples

### Example 1: Frontend Tool
```yaml
---
id: idea-2026-01-15-001
title: "Component Dependency Visualizer"
generated: 2026-01-15T09:30:00+09:00

category: developer-tool
subcategory: frontend-analysis
difficulty: intermediate
tags: [react, visualization, d3, dependency-graph, typescript]

estimated_time: "1-2 weeks"
tech_stack: [React, TypeScript, D3.js, Vite]
languages: [TypeScript, CSS]

evaluation:
  originality: 7
  feasibility: 8
  market_need: 6
  monetization_potential: 4
  tech_interest: 8
  learning_value: 7
  open_source_value: 8
  
  total: 7.0
  iterations: 1
  status: pass

related_projects: [heritage]
inspiration_source: "Personal pain point - monorepo component tracking"
---
```

### Example 2: Creative Experiment
```yaml
---
id: idea-2026-01-15-002
title: "Metroidvania Code Explorer"
generated: 2026-01-15T14:20:00+09:00

category: experimental
subcategory: developer-tool
difficulty: advanced
tags: [gaming, code-exploration, webgl, three-js, interactive]

estimated_time: "3-4 weeks"
tech_stack: [Three.js, React, TypeScript, AST Parser]
languages: [TypeScript, GLSL]

evaluation:
  originality: 10
  feasibility: 6
  market_need: 5
  monetization_potential: 3
  tech_interest: 10
  learning_value: 9
  open_source_value: 7
  
  total: 7.4
  iterations: 2
  status: pass

inspiration_source: "Metroidvania game mechanics → code exploration"
---
```

### Example 3: Data Project
```yaml
---
id: idea-2026-01-15-003
title: "Baseball Pitch Sequence Analyzer"
generated: 2026-01-15T18:45:00+09:00

category: visualization
subcategory: baseball-analytics
difficulty: intermediate
tags: [baseball, data-viz, d3, sports-analytics, react]

estimated_time: "2 weeks"
tech_stack: [React, D3.js, TypeScript, Vite]
languages: [TypeScript, Python]

evaluation:
  originality: 6
  feasibility: 9
  market_need: 5
  monetization_potential: 4
  tech_interest: 7
  learning_value: 6
  open_source_value: 6
  
  total: 6.4
  iterations: 3
  status: pass

inspiration_source: "Baseball fandom + data visualization expertise"
---
```

---

## 🔗 Related Documents

- `0-context.md`: Informs category, tags, tech_stack choices
- `2-output-template.md`: Uses this frontmatter structure
- `3-evaluation-criteria.md`: Defines scoring logic and thresholds

---

**Last Updated**: 2026-01-17

# Evaluation Criteria

> Defines how ideas are scored and what qualifies as "pass"

---

## 🎯 Scoring Philosophy

### Core Principle

**Quality over quantity**. Better to generate 1 excellent idea per week than 7 mediocre ones per day.

### Evaluation Goals

- Filter out generic/trivial ideas
- Encourage unique angles
- Ensure buildability
- Maintain high standards

---

## 📊 The 7 Dimensions

All dimensions scored **1-10**, where:

| Range | Label                 |
|-------|-----------------------|
| 1-3   | Poor/Weak             |
| 4-6   | Fair/Acceptable       |
| 7-8   | Good/Strong           |
| 9-10  | Excellent/Outstanding |

---

### 1. Originality (독창성)

**What it measures**: How unique or novel is this idea?

#### Scoring Guide

**9-10 Outstanding**
- Never seen this combination before
- Fresh perspective on familiar problem
- Unexpected cross-domain mashup
- "Why didn't anyone think of this?"
- Examples: Metroidvania-inspired code explorer, Baseball pitch sequences as narrative arcs

**7-8 Good**
- Some novel aspects
- Familiar concept, different execution
- Incremental innovation
- Examples: Better UI for existing tool, New visualization for known data

**4-6 Fair**
- Minor variations on existing
- Competent but not groundbreaking
- Safe choices
- Examples: Another dashboard, Standard CRUD with twist

**1-3 Poor**
- Very common project type
- Saturated space
- "Yet another X app"
- Examples: Todo list, Note-taking app, Generic portfolio site

#### Key Questions
- Has this been done before?
- What makes it different?
- Would it stand out in GitHub Trending?

---

### 2. Feasibility (실현가능성)

**What it measures**: Can this realistically be built in 2-4 weeks?

#### Scoring Guide

**9-10 Very Feasible**
- Clear technical path
- Libraries/tools exist
- Minimal unknowns
- Hours to 2 weeks depending on scope
- Indicators: Existing examples to reference, Mature ecosystem, Well-documented APIs
- Note: Small scope ≠ low score. A well-scoped 4-hour utility can score 10.

**7-8 Feasible**
- Some challenges but manageable
- May need learning
- 2-3 weeks realistic
- Indicators: Some unknowns but googling helps, Active community support

**4-6 Challenging**
- Significant hurdles
- Requires substantial research
- 4-6 weeks minimum
- Indicators: Novel algorithms needed, Performance critical

**1-3 Very Hard**
- Major technical unknowns
- Research-level problems
- 2+ months minimum
- Indicators: No existing examples, Cutting-edge tech required

#### Key Questions
- What are the hard parts?
- Do libraries exist for this?
- Have I done similar things before?
- Can I prototype in a day?

---

### 3. Market Need (시장 필요성)

**What it measures**: How severe is the problem this solves?

#### Scoring Guide

**9-10 Critical Need**
- Daily pain point
- Many people affected
- Current solutions terrible
- Examples: Automate tedious daily task, Fix broken workflow

**7-8 Clear Need**
- Regular annoyance
- Niche but real problem
- Current solutions inadequate
- Examples: Better tool for specific task, Developer productivity boost

**4-6 Mild Need**
- Occasional issue
- Workarounds exist
- Nice-to-have
- Examples: Slightly better alternative, Convenience feature

**1-3 Weak Need**
- Rare problem
- Easy workarounds
- Self-created need
- Examples: Already solved adequately, Over-engineering

#### Key Questions
- Who has this problem?
- How often does it occur?
- What do they do now?
- Would they use this?

---

### 4. Monetization Potential (수익화 가능성)

**What it measures**: Could this generate revenue?

> **Note**: Low score is perfectly fine! Not all projects need money.

#### Scoring Guide

**9-10 Strong Potential**
- Clear business model
- People pay for similar
- B2B opportunity
- Examples: Developer tool with pro features, Productivity SaaS

**7-8 Possible**
- Freemium model viable
- Sponsorship potential
- Examples: Open source with paid features, API with usage limits

**4-6 Uncertain**
- Indirect monetization
- Tips/donations
- Examples: Open source library, Personal brand building

**1-3 Unlikely**
- Pure open source
- No clear revenue path
- Examples: Educational projects, Hobby tools

#### Key Questions
- Would anyone pay for this?
- What's the business model?
- Are there successful comparable?

---

### 5. Tech Interest (기술적 흥미)

**What it measures**: How technically engaging is this to build?

#### Scoring Guide

**9-10 Fascinating**
- Novel technical challenge
- Deep learning opportunity
- Creative problem-solving
- Examples: 3D graphics programming, Real-time data processing, Algorithm design

**7-8 Interesting**
- Some new techniques
- Solidify existing skills
- Examples: New framework/library, Architectural patterns, API integration

**4-6 Standard**
- Routine implementation
- Familiar patterns
- Examples: CRUD operations, Standard UI components

**1-3 Boring**
- Repetitive work
- No learning value
- Examples: Copy-paste from tutorial, Trivial modifications

#### Key Questions
- Will I learn something new?
- Is there a technical challenge?
- Will this be fun to build?
- Can I show off the tech?

---

### 6. Learning Value (학습 가치)

**What it measures**: How much will I grow from building this?

#### Scoring Guide

**9-10 Transformative**
- Opens entirely new domain knowledge
- Forces deep understanding of fundamentals
- Skills transferable to many future projects
- "I'll think differently after this"
- Indicators: New paradigm, Unfamiliar territory, Conceptual depth

**7-8 Significant Growth**
- Solidifies important concepts
- Introduces new techniques
- Practical skills gained
- Indicators: Hands-on with new tools, Architectural thinking required

**4-6 Moderate Learning**
- Reinforces existing knowledge
- Minor new techniques
- Indicators: Familiar patterns, Some new APIs

**1-3 Minimal Growth**
- Already know how to do this
- Repetitive work
- Indicators: Copy-paste territory, No stretch

#### Key Questions
- What will I understand better after this?
- Will this change how I approach problems?
- Are there concepts I'll finally "get"?
- Is this outside my comfort zone?

---

### 7. Open Source Value (오픈소스 가치)

**What it measures**: How beneficial to community?

#### Scoring Guide

**9-10 High Value**
- Fills clear gap
- Many potential users
- Highly reusable
- Small focused library that solves one problem well
- "npm install and it works" type of package
- Examples: Missing npm package for common task, Utility library everyone copies from Stack Overflow, Single-purpose tool that saves hours

**7-8 Good Value**
- Useful to niche
- Some reusability
- Educational value
- Examples: Domain-specific tool, Plugin/extension

**4-6 Limited Value**
- Very specific use case
- Moderate reusability
- Examples: Personal workflow tool, Proof of concept

**1-3 Low Value**
- Too specific/personal
- Hard to generalize
- Examples: One-off script, No broader application

#### Key Questions
- Would others use this?
- Is it easy to adapt?
- Can I document it well?
- Is there a community?

---

## 🎯 Pass/Fail Criteria

### Passing Conditions

An idea **PASSES** if it meets **ANY** of these conditions:

| Option | Condition                                                                                    | Reasoning                                                       |
|--------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| 1      | `total_score >= 7.0`                                                                         | Consistently good across all dimensions                         |
| 2      | `(originality >= 8 AND tech_interest >= 8)` OR `(learning_value >= 9 AND feasibility >= 7)` | Outstanding in creativity OR high growth potential with buildability |
| 3      | `(feasibility >= 8 AND market_need >= 8)` AND `(total_score >= 6.5)`                         | Highly practical and needed, even if not groundbreaking         |

### Failing Conditions

An idea **FAILS** if:

- `total_score < 7.0` AND no excellence criteria met
- `originality <= 4` (too generic)
- `feasibility <= 3` (unrealistic to build)
- ALL scores <= 5 (mediocre across board)

### Edge Cases

| Scenario                                     | Decision | Reason                                            |
|----------------------------------------------|----------|---------------------------------------------------|
| total = 7.2, feasibility = 3                 | FAIL     | Can't build it, other scores don't matter         |
| total = 6.8, originality = 10, portfolio = 9 | PASS     | Unique and impressive outweighs average elsewhere |
| All scores = 6, total = 6.0                  | FAIL     | Too mediocre, won't be interesting                |

---

## 📈 Weighted Average Calculation

### Formula

```typescript
total_score = (
  originality * 0.15 +
  feasibility * 0.20 +
  market_need * 0.15 +
  monetization_potential * 0.10 +
  tech_interest * 0.15 +
  learning_value * 0.15 +
  open_source_value * 0.10
)
```

### Weight Rationale

| Dimension              | Weight | Reason                                       |
|------------------------|--------|----------------------------------------------|
| feasibility            | 20%    | Can't build it = scores don't matter         |
| originality            | 15%    | Makes it worth building                      |
| tech_interest          | 15%    | Makes it worth building                      |
| learning_value         | 15%    | Personal growth opportunity                  |
| market_need            | 15%    | Nice but not essential for personal projects |
| monetization_potential | 10%    | Bonus, not requirement                       |
| open_source_value      | 10%    | Bonus, not requirement                       |

### Example Calculation

| Dimension              | Score | Weight | Weighted |
|------------------------|-------|--------|----------|
| originality            | 8     | 0.15   | 1.20     |
| feasibility            | 7     | 0.20   | 1.40     |
| market_need            | 6     | 0.15   | 0.90     |
| monetization_potential | 5     | 0.10   | 0.50     |
| tech_interest          | 9     | 0.15   | 1.35     |
| learning_value         | 8     | 0.15   | 1.20     |
| open_source_value      | 7     | 0.10   | 0.70     |
| **Total**              |       |        | **7.25** |

Result: **PASS** (total >= 7.0)

---

## 🎲 Evaluation Examples

### Example 1: Strong Pass

**Idea**: Metroidvania Code Explorer

| Dimension              | Score   | Note                   |
|------------------------|---------|------------------------|
| originality            | 10      | Never seen before      |
| feasibility            | 6       | Challenging but doable |
| market_need            | 5       | Niche need             |
| monetization_potential | 3       | Probably free          |
| tech_interest          | 10      | Extremely interesting  |
| learning_value         | 9       | Deep learning opportunity |
| open_source_value      | 7       | Educational value      |
| **Total**              | **7.4** |                        |

**Result**: PASS (Option 2: originality 10 + tech_interest 10)

**Reasoning**: Unique and fascinating to build outweighs practical concerns

---

### Example 2: Borderline Fail → Pass after Refinement

**Idea**: Baseball Pitch Analyzer

| Dimension              | Score   | Note               |
|------------------------|---------|--------------------|
| originality            | 6       | Some similar exist |
| feasibility            | 9       | Very buildable     |
| market_need            | 5       | Baseball fans only |
| monetization_potential | 4       | Niche market       |
| tech_interest          | 7       | D3 practice        |
| learning_value         | 6       | Moderate growth    |
| open_source_value      | 6       | Some value         |
| **Total**              | **6.5** |                    |

**Result**: FAIL (< 7.0 and no excellence criteria met)

**Reasoning**: Too middle-of-the-road, nothing stands out

**After Refinement** (Add real-time pitch prediction using ML):
- tech_interest: 7 → 9
- learning_value: 6 → 8
- new_total: 7.1
- **New Result**: PASS

---

### Example 3: Clear Fail

**Idea**: Todo List with React

| Dimension              | Score   | Note             |
|------------------------|---------|------------------|
| originality            | 2       | Extremely common |
| feasibility            | 10      | Trivial          |
| market_need            | 2       | Saturated        |
| monetization_potential | 1       | No chance        |
| tech_interest          | 3       | Boring           |
| learning_value         | 2       | Nothing new      |
| open_source_value      | 1       | Pointless        |
| **Total**              | **3.1** |                  |

**Result**: FAIL (multiple conditions met)

**Reasoning**: Generic, uninspiring, archive immediately without refinement attempt

---

## 🔍 Self-Evaluation Checklist

Before finalizing scores, agent should verify:

### Honesty Check
- [ ] Am I inflating scores to meet threshold?
- [ ] Are these scores justified?
- [ ] Would a human agree?

### Consistency Check
- [ ] Do scores align with descriptions?
- [ ] Are similar projects scored similarly?
- [ ] Is logic internally consistent?

### Threshold Gaming Prevention
- [ ] Am I giving 7s just to pass?
- [ ] Do 9-10 scores truly deserve it?
- [ ] Are 1-3 scores appropriately harsh?

---

## 🎯 Quality Philosophy

### Better to Fail Than Settle

> 1 excellent idea > 10 mediocre ideas

Don't lower standards to increase output. The goal is **curated quality**.

### Harsh but Fair
- Be honest about weaknesses
- Don't sugarcoat problems
- Celebrate genuine strengths
- Fail ideas that deserve to fail

### Growth Mindset
- Each failure teaches what works
- Refinement improves pattern recognition
- Over time, first attempts improve

---

## 🔗 Related Documents

- `0-context.md`: Informs scoring context (user preferences)
- `1-frontmatter-spec.md`: Defines evaluation fields structure
- `2-output-template.md`: Documents that pass get formatted here
- `4-refinement-protocol.md`: Detailed refinement strategies

---

**Last Updated**: 2026-01-20

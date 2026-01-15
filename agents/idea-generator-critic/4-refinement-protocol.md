# Refinement Protocol

> Defines how to improve ideas that fail initial evaluation

---

## 🎯 Purpose

Not every idea passes on the first try. This document defines:

- When to attempt refinement vs. abandon
- How to identify weaknesses
- Strategies for improving each dimension
- When to stop trying

---

## 🔄 Refinement Flow

```
┌─────────────────┐
│  Generate Idea  │
└────────┬────────┘
         ▼
┌─────────────────┐
│    Evaluate     │
└────────┬────────┘
         ▼
    ┌────┴────┐
    │  Pass?  │
    └────┬────┘
    YES  │  NO
    ▼    ▼
┌──────┐ ┌──────────────┐
│ Done │ │ Analyze Weak │
└──────┘ └──────┬───────┘
                ▼
         ┌──────────────┐
         │   Refine     │
         └──────┬───────┘
                ▼
         ┌──────────────┐
         │ Re-evaluate  │
         └──────┬───────┘
                ▼
           ┌────┴────┐
           │ Pass?   │
           └────┬────┘
           YES  │  NO
           ▼    ▼
       ┌──────┐ ┌────────────┐
       │ Done │ │ Iteration  │
       └──────┘ │ < 3?       │
                └─────┬──────┘
                 YES  │  NO
                 ▼    ▼
         ┌─────────┐ ┌─────────┐
         │ Refine  │ │ Archive │
         │ Again   │ │ (Fail)  │
         └─────────┘ └─────────┘
```

---

## ⚙️ Configuration

| Parameter         | Value | Reasoning                                         |
|-------------------|-------|---------------------------------------------------|
| max_iterations    | 3     | Diminishing returns after 3 attempts              |
| min_improvement   | 0.5   | Must improve by at least 0.5 points per iteration |
| abandon_threshold | 4.0   | Don't bother refining if total < 4.0              |

---

## 🚫 When NOT to Refine

Immediately archive (skip refinement) if:

| Condition                | Reason                                 |
|--------------------------|----------------------------------------|
| `total_score < 4.0`      | Fundamentally flawed, not worth saving |
| `originality <= 2`       | Too generic, needs complete rethink    |
| `feasibility <= 2`       | Unrealistic, scope too ambitious       |
| Multiple dimensions <= 3 | Too many problems to fix               |

**Philosophy**: Some ideas should die. Don't waste effort polishing garbage.

---

## 🔍 Weakness Analysis

### Step 1: Identify Problem Dimensions

After evaluation, categorize each score:

| Category   | Score Range | Action                |
|------------|-------------|-----------------------|
| Critical   | 1-3         | Must fix or abandon   |
| Weak       | 4-5         | Should improve        |
| Acceptable | 6-7         | Can improve if easy   |
| Strong     | 8-10        | Preserve, don't break |

### Step 2: Prioritize Fixes

Fix in this order (highest impact first):

1. **feasibility** - Can't build = everything else meaningless
2. **originality** - Generic ideas aren't worth building
3. **tech_interest** - Boring to build = won't finish
4. **portfolio_value** - No impact = why bother
5. **market_need** - Nice to have
6. **open_source_value** - Bonus
7. **monetization_potential** - Optional

### Step 3: Check Constraints

Before refining, verify:

- Can this dimension realistically improve?
- Will improving it break other strong dimensions?
- Is the core idea salvageable?

---

## 🛠️ Refinement Strategies by Dimension

### 1. Low Originality (< 6)

**Diagnosis**: Idea is too common or derivative

**Strategies**:

| Strategy          | Description                          | Example                                                         |
|-------------------|--------------------------------------|-----------------------------------------------------------------|
| Domain Mashup     | Combine with unexpected field        | Task app → Task app with Metroidvania mechanics                 |
| Niche Focus       | Target specific underserved audience | Dashboard → Dashboard for color-blind developers                |
| Novel Interaction | Change how users interact            | CLI tool → Voice-controlled CLI                                 |
| Perspective Flip  | Approach from opposite angle         | Code linter → Code "unlinter" that suggests creative violations |
| Tech Twist        | Apply unusual technology             | Note app → Note app with spatial audio organization             |

**Questions to ask**:
- What if this was for [unexpected audience]?
- What if combined with [unrelated hobby/interest]?
- What's the opposite of how this is usually done?

---

### 2. Low Feasibility (< 6)

**Diagnosis**: Too complex, too many unknowns, or too time-consuming

**Strategies**:

| Strategy              | Description                   | Example                                      |
|-----------------------|-------------------------------|----------------------------------------------|
| Scope Reduction       | Cut features to MVP           | Full game engine → Single game mechanic demo |
| Library Leverage      | Use existing solutions        | Custom 3D renderer → Three.js wrapper        |
| Simplify Architecture | Remove unnecessary complexity | Microservices → Monolith                     |
| Phase Split           | Break into smaller projects   | Complete platform → Just the core feature    |
| Tech Downgrade        | Use simpler technology        | Real-time sync → Polling                     |

**Questions to ask**:
- What's the smallest version that proves the concept?
- Which features can be "fake" for MVP?
- What existing libraries solve the hard parts?

---

### 3. Low Market Need (< 6)

**Diagnosis**: Problem isn't painful enough or audience too small

**Strategies**:

| Strategy           | Description                         | Example                                   |
|--------------------|-------------------------------------|-------------------------------------------|
| Pain Amplification | Find more severe version of problem | Slight annoyance → Daily frustration      |
| Audience Expansion | Target broader group                | Just me → All frontend devs               |
| Frequency Increase | Focus on recurring problems         | Yearly task → Daily task                  |
| Problem Reframe    | Describe differently                | "Nice to have" → "Hours saved per week"   |
| Competitor Gap     | Find what existing solutions miss   | Generic tool → Tool for specific workflow |

**Questions to ask**:
- Who else has this problem?
- How often does this really happen?
- What are people complaining about in forums?

---

### 4. Low Monetization Potential (< 6)

**Diagnosis**: No clear path to revenue

**Note**: This is often acceptable! Not every project needs to make money.

**Strategies** (if monetization is desired):

| Strategy           | Description                 | Example                        |
|--------------------|-----------------------------|--------------------------------|
| Freemium Model     | Core free, premium features | Free viewer, paid editor       |
| B2B Pivot          | Target businesses instead   | Consumer tool → Team tool      |
| Support/Consulting | Monetize expertise          | Free OSS → Paid setup service  |
| Content Upsell     | Monetize knowledge          | Free tool → Paid course        |
| API Tier           | Usage-based pricing         | Free tier → Paid higher limits |

**Questions to ask**:
- Would a company pay for this?
- What premium features would justify payment?
- Is there a "pro" version?

---

### 5. Low Tech Interest (< 6)

**Diagnosis**: Boring to build, no learning opportunity

**Strategies**:

| Strategy              | Description                       | Example                                           |
|-----------------------|-----------------------------------|---------------------------------------------------|
| Add Visualization     | Include visual/graphical elements | Data processor → Data processor with D3 viz       |
| Performance Challenge | Add optimization goals            | Working app → App that handles 10k items smoothly |
| Algorithm Addition    | Include interesting computation   | Simple CRUD → CRUD with smart suggestions         |
| New Tech Integration  | Use technology you want to learn  | jQuery app → React + TypeScript app               |
| Architecture Upgrade  | Apply advanced patterns           | Spaghetti → Clean architecture                    |

**Questions to ask**:
- What technology have I been wanting to try?
- Can I add a visualization layer?
- Is there an algorithmic challenge I can introduce?

---

### 6. Low Portfolio Value (< 6)

**Diagnosis**: Won't impress in interviews, nothing to demo

**Strategies**:

| Strategy              | Description                     | Example                                        |
|-----------------------|---------------------------------|------------------------------------------------|
| Visual Polish         | Add impressive UI/UX            | Functional but ugly → Beautiful and functional |
| Demo-ability          | Make it screencast-worthy       | Hard to explain → Obvious in 30 seconds        |
| Complexity Sweet Spot | Not too simple, not too complex | Todo app → Project management with Gantt       |
| Talking Points        | Add architectural decisions     | Just works → Interesting trade-offs to discuss |
| Uniqueness            | Stand out from common projects  | Generic portfolio → Distinctive approach       |

**Questions to ask**:
- Would I want to demo this?
- Can I explain interesting decisions?
- Does it photograph well?

---

### 7. Low Open Source Value (< 6)

**Diagnosis**: Too specific, hard to reuse, no community need

**Strategies**:

| Strategy            | Description            | Example                                       |
|---------------------|------------------------|-----------------------------------------------|
| Generalization      | Make less specific     | My workflow tool → Configurable workflow tool |
| Documentation       | Make it understandable | Code dump → Well-documented library           |
| Plugin Architecture | Allow extension        | Monolithic → Plugin-based                     |
| API Exposure        | Let others build on it | Closed app → App with public API              |
| Template Extraction | Share the pattern      | One-off solution → Reusable template          |

**Questions to ask**:
- How would someone else use this?
- What configuration would they need?
- Is this solving a common enough problem?

---

## 📝 Refinement Template

When refining, document the changes:

```markdown
## Refinement Report

### Iteration: [1/2/3]

### Previous Score: [X.X]

### Identified Weaknesses
| Dimension | Score | Issue |
|-----------|-------|-------|
| [name] | [score] | [specific problem] |

### Applied Strategies
| Weakness | Strategy | Change Made |
|----------|----------|-------------|
| [dimension] | [strategy name] | [specific modification] |

### Modified Idea Summary
[Brief description of refined idea]

### Expected Impact
| Dimension | Before | After (Expected) | Reasoning |
|-----------|--------|------------------|-----------|
| [name] | [old] | [new] | [why it should improve] |

### New Score: [X.X]

### Result: [PASS/FAIL/CONTINUE]
```

---

## 🎯 Refinement Examples

### Example 1: Successful Refinement

**Original Idea**: File organizer CLI tool

**Initial Scores**:

| Dimension              | Score   |
|------------------------|---------|
| originality            | 4       |
| feasibility            | 9       |
| market_need            | 5       |
| monetization_potential | 3       |
| tech_interest          | 4       |
| portfolio_value        | 4       |
| open_source_value      | 5       |
| **Total**              | **5.0** |

**Analysis**: Feasibility is great, but boring and generic.

**Refinement Strategy**:
- originality: Add 3D visualization of file system
- tech_interest: Use Three.js for spatial navigation
- portfolio_value: Make it visually impressive

**Refined Idea**: 3D File System Explorer - Navigate your files in a Metroidvania-style 3D space

**New Scores**:

| Dimension       | Before  | After   |
|-----------------|---------|---------|
| originality     | 4       | 8       |
| feasibility     | 9       | 7       |
| tech_interest   | 4       | 9       |
| portfolio_value | 4       | 9       |
| **Total**       | **5.0** | **7.6** |

**Result**: PASS

---

### Example 2: Failed Refinement (Abandoned)

**Original Idea**: Real-time multiplayer VR code review

**Initial Scores**:

| Dimension              | Score   |
|------------------------|---------|
| originality            | 9       |
| feasibility            | 2       |
| market_need            | 4       |
| monetization_potential | 3       |
| tech_interest          | 8       |
| portfolio_value        | 7       |
| open_source_value      | 4       |
| **Total**              | **5.1** |

**Analysis**: Creative but completely unrealistic to build in 2-4 weeks.

**Iteration 1**: Reduce to single-player VR → feasibility: 4 (still too hard)

**Iteration 2**: Remove VR, just 3D → loses originality: 5

**Iteration 3**: Add back some VR elements → feasibility drops again: 3

**Result**: ABANDONED - Core concept requires VR which kills feasibility. The interesting part IS the VR, removing it makes it boring.

**Learning**: Some ideas are inherently all-or-nothing. Can't half-ass VR.

---

### Example 3: Refinement with Trade-offs

**Original Idea**: AI-powered code generator

**Initial Scores**:

| Dimension              | Score   |
|------------------------|---------|
| originality            | 3       |
| feasibility            | 7       |
| market_need            | 8       |
| monetization_potential | 7       |
| tech_interest          | 6       |
| portfolio_value        | 5       |
| open_source_value      | 4       |
| **Total**              | **5.7** |

**Analysis**: Market exists, buildable, but too generic (Copilot, etc. exist)

**Refinement Strategy**: Niche down dramatically

**Refined Idea**: AI code generator specifically for React Native animations with live preview

**Trade-offs**:
- market_need: 8 → 6 (smaller audience)
- originality: 3 → 8 (nothing like this exists)
- portfolio_value: 5 → 8 (demonstrates niche expertise)

**New Total**: 7.2

**Result**: PASS - Accepted trade-off of smaller market for higher originality

---

## ⚠️ Common Refinement Pitfalls

### 1. Over-refinement

**Symptom**: Idea becomes Frankenstein's monster of features

**Solution**: Each refinement should be surgical, not additive

### 2. Breaking What Works

**Symptom**: Improving one dimension tanks another

**Solution**: Check impact on ALL dimensions before changing

### 3. Threshold Gaming

**Symptom**: Tweaking just enough to hit 7.0

**Solution**: Aim for genuine improvement, not minimum viable pass

### 4. Sunk Cost Fallacy

**Symptom**: Continuing to refine fundamentally broken idea

**Solution**: If iteration 2 shows no meaningful progress, abandon

### 5. Scope Creep

**Symptom**: "Just one more feature" syndrome

**Solution**: Refinement should simplify, not complicate

---

## 🔗 Related Documents

- `3-evaluation-criteria.md`: Defines scoring that triggers refinement
- `2-output-template.md`: Format for refined ideas that pass
- `5-deployment.md`: What happens after successful refinement

---

**Last Updated**: 2026-01-16

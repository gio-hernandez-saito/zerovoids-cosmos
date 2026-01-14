# Contributing to zerovoids-subagents

Thank you for your interest in contributing! This guide will help you create high-quality agents and maintain the repository's standards.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/zerovoids-subagents.git`
3. **Install dependencies**: `npm install` (this sets up git hooks automatically)
4. **Make your changes** (we use main branch for all work)
5. **Commit with proper format** (see Commit Message Format below)
6. **Submit a pull request**

## Commit Message Format

We enforce a simple, consistent commit message format using a git hook.

### Format

```
[prefix]: [제목]

- 내용 1
- 내용 2
- 내용 3
```

### Allowed Prefixes

- `feat`: New feature or agent
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code restructuring without functionality change
- `chore`: Maintenance tasks
- `revert`: Revert previous commit

### Rules

1. **첫 줄**: `prefix: 제목` (콜론 뒤에 띄어쓰기 필수)
2. **두 번째 줄**: 비어있어야 함
3. **본문**: 각 줄은 `- ` (대시 + 띄어쓰기)로 시작

### Examples

**Good:**
```
feat: add react-optimizer agent

- Optimize React component re-renders
- Add useMemo suggestions
- Check dependency arrays
```

```
fix: correct template frontmatter

- Fix missing created field
- Update example formatting
```

```
docs: update architecture guide

- Add section on agent lifecycle
- Clarify category purposes
```

**Bad:**
```
feat:add agent          # ❌ 콜론 뒤 띄어쓰기 없음
```

```
add agent               # ❌ prefix 없음
```

```
feat: add agent
내용 추가               # ❌ 두 번째 줄이 비어있지 않음
```

```
feat: add agent

내용 추가               # ❌ '- '로 시작하지 않음
```

### Validation

The commit hook will automatically validate your message format. If it fails, you'll see an error with guidance on how to fix it.

## Creating a New Agent

### Quick Method

```bash
./bin/add-agent my-agent-name core
```

This creates a new agent from the template with proper formatting.

### Manual Method

1. Copy `agents/_template.md` to the appropriate category
2. Rename to `your-agent-name.md`
3. Fill in all sections thoroughly

### Agent Checklist

Before submitting, ensure your agent has:

- [ ] **Clear, specific name** (lowercase-with-hyphens)
- [ ] **Complete frontmatter** (name, description, created date)
- [ ] **Specific description** (20+ characters, describes triggers clearly)
- [ ] **Well-defined responsibilities** (primary and secondary)
- [ ] **Concrete examples** (at least 2 scenarios)
- [ ] **Explicit limitations** (what NOT to do)
- [ ] **Related agents** (if applicable)
- [ ] **Tested locally** (works in actual Claude Code usage)

## Quality Standards

### Description Guidelines

Your description is the most important part - it tells Claude Code when to use your agent.

**Good Descriptions:**
```yaml
description: Use PROACTIVELY when TypeScript files are modified. Expert in type safety, generics, and TypeScript best practices for large codebases.
```

**Bad Descriptions:**
```yaml
description: TypeScript helper
description: Helps with TypeScript code
```

### Naming Conventions

**Agent Names:**
- Lowercase only
- Hyphens for spaces
- Descriptive and specific
- Avoid generic terms (helper, utils, manager)

**Good Names:**
- `react-hook-optimizer`
- `api-security-auditor`
- `database-migration-validator`

**Bad Names:**
- `helper`
- `typescript-util`
- `frontend-stuff`

### Categories

Choose the right category:

- **`core/`**: Framework-agnostic, works everywhere
  - Examples: code-reviewer, debugger, test-writer

- **`specialized/`**: Domain or framework-specific
  - Examples: react-optimizer, sql-query-builder, docker-troubleshooter

- **`meta/`**: Repository management
  - Examples: repo-manager, agent-creator

When in doubt, start with `specialized/` - we can recategorize later.

## Testing Your Agent

### Local Testing

1. **Link to a test project**:
   ```bash
   ./bin/setup /path/to/test-project
   ```

2. **Use Claude Code in that project**:
   ```bash
   cd /path/to/test-project
   claude "trigger condition for your agent"
   ```

3. **Verify behavior**:
   - Does Claude Code invoke your agent?
   - Does it perform as expected?
   - Is the output useful?

### Validation

Run the validation script:
```bash
./bin/validate
```

Fix any errors or warnings before submitting.

## Documentation

### Updating the Catalog

The agent catalog (`agents/README.md`) is auto-generated. Don't edit it manually.

After adding your agent, you can generate the updated catalog (optional - CI will do this):
```bash
# This script doesn't exist yet, but will be added
./bin/generate-catalog
```

### Evolution Log

If your change affects repository structure or introduces new patterns, document it in `docs/evolution-log.md`:

```markdown
## 2025-01-15: Added Database Category

**Reasoning**: We now have 5 database-related agents, warranting a dedicated subdirectory.

**Changes**:
- Created `specialized/database/`
- Moved 5 agents: sql-optimizer, migration-validator, etc.
- Updated profiles to reflect new paths

**Impact**: Better organization, easier to find database agents
```

## Pull Request Guidelines

### PR Title

Use conventional commit format:
- `feat: add react-performance-optimizer agent`
- `fix: correct code-reviewer frontmatter`
- `docs: improve agent writing guide`
- `refactor: reorganize specialized agents`

### PR Description

Include:

1. **What**: What agent/change are you adding?
2. **Why**: What problem does it solve?
3. **Testing**: How did you test it?
4. **Examples**: Show it working (screenshot/output)

**Template:**
```markdown
## What
Added a new agent for [purpose]

## Why
This agent helps with [problem] by [solution]

## Testing
- Tested on project: [project name/type]
- Triggered by: [command/situation]
- Output: [what it produced]

## Examples
[paste example output or screenshot]

## Checklist
- [ ] Follows naming conventions
- [ ] Complete frontmatter
- [ ] Includes examples
- [ ] Passes validation
- [ ] Tested locally
```

## Code Review Process

### What We Look For

1. **Clarity**: Is the agent's purpose immediately clear?
2. **Specificity**: Does it have a focused, well-defined scope?
3. **Quality**: Is the system prompt comprehensive and helpful?
4. **Examples**: Are there concrete usage examples?
5. **Testing**: Has it been tested in real usage?

### Feedback

Reviews may request:
- More specific descriptions
- Additional examples
- Clearer boundaries/limitations
- Better naming
- Recategorization

This is normal! We want high-quality agents.

## Best Practices

### Writing System Prompts

**Do:**
- Be specific about the agent's expertise
- Include concrete examples
- Define clear boundaries
- Explain the reasoning behind recommendations
- Use bullet points and structure

**Don't:**
- Be vague or generic
- Assume knowledge of context
- Overlap heavily with existing agents
- Include unnecessary complexity

### Tool Selection

Only specify tools if you need to restrict them:

```yaml
# Inherit all tools (recommended)
tools: Bash, Read, Write

# Restrict for safety
tools: Read  # Read-only agent
```

### Model Selection

```yaml
# Use default (recommended for most)
model: sonnet

# Use opus for complex reasoning
model: opus

# Use haiku for simple tasks
model: haiku

# Inherit from parent
model: inherit
```

## Community

### Questions?

- Open an issue with the `question` label
- Check existing issues first
- Be specific about what you're trying to achieve

### Suggestions?

- Open an issue with the `enhancement` label
- Explain the use case
- Describe the proposed agent or feature

### Found a Bug?

- Open an issue with the `bug` label
- Include steps to reproduce
- Share your environment details

## Code of Conduct

- Be respectful and constructive
- Focus on the work, not the person
- Welcome newcomers
- Assume good intentions
- Keep discussions productive

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make zerovoids-subagents better! Every contribution, no matter how small, is valued.

---
**Last Updated**: 2026-01-14

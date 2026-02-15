# Plan Issue

Deep-dive into a specific Linear issue and produce an implementation plan. Pass the issue identifier as an argument (e.g., `/plan-issue CSS-20`).

## Arguments

$ARGUMENTS — The Linear issue identifier (e.g., CSS-20) or issue title keywords

## Instructions

### 1. Fetch the issue from Linear

- Use the Linear MCP server to get the issue by its identifier: `$ARGUMENTS`
- If not found by identifier, search by title keywords in the CENIE Editorial Web project

### 2. Parse the issue description

Extract from the structured description:
- **Context**: Why this issue exists
- **Target files**: Files to create or modify
- **Reference files**: Files to read for patterns/context
- **Requirements**: What must be true when done
- **Technical approach**: Suggested implementation strategy
- **Conventions**: Rules to follow
- **Verification**: How to confirm it's done
- **Out of scope**: What NOT to do

### 3. Read all relevant files

- Read every file listed in **Target files** (to understand current state)
- Read every file listed in **Reference files** (to understand patterns)
- If any files don't exist yet (marked "create"), note that

### 4. Analyze and plan

- Identify potential complications or ambiguities in the requirements
- Check if any dependencies are unmet (read blockedBy issues if any)
- Design a step-by-step implementation plan:
  1. What to do first
  2. What to do second
  3. etc.
- Estimate which files will have the most changes

### 5. Flag issues

If you find any of these, flag them before proceeding:
- Missing information in the issue description
- Conflicting requirements
- Dependencies that should be completed first
- Technical risks or unknowns
- Files referenced in the issue that don't exist

### 6. Enter plan mode

Present the implementation plan and enter plan mode for user approval before coding.

## Important

- ALWAYS read the files before planning — don't guess about current state
- Respect the "Out of Scope" section strictly
- Follow the "Conventions" section exactly
- If the issue has a `Research First` label, spend more time exploring before planning

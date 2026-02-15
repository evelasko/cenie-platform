# Pick Issue

Start a work session by finding and claiming the next available issue from the CENIE Editorial Web project in Linear.

## Instructions

1. **Query Linear** for issues in the **CENIE Editorial Web** project on the **CincoSeiSiete** team that are:
   - Status: `Todo`
   - Not blocked by other incomplete issues
   - In the current or next cycle (prefer current cycle first)
   - Sort by priority (Urgent > High > Medium > Low), then by estimate (lower first)

2. **Present the available issues** to the user in a table showing: identifier, title, priority, estimate, labels, and cycle.

3. **Let the user choose** which issue to work on (or suggest the top candidate).

4. **Once an issue is selected:**
   a. Update the issue status to `In Progress` in Linear
   b. Read the full issue description
   c. Read all **target files** listed in the issue's Scope section
   d. Read all **reference files** listed in the issue's Scope section
   e. Summarize the issue requirements and technical approach

5. **Enter plan mode** to design the implementation approach for the selected issue.

## Important

- Always run `/editorial-context` first if this is a fresh session
- Prefer issues with the `Foundation` label first (they unblock other work)
- Prefer `Self-Contained` issues over `Cross-Cutting` when starting out
- Never pick an issue that is blocked by an incomplete dependency

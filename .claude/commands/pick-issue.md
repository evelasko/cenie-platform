# Pick Issue

Start a work session by finding and claiming the next available issue from the CENIE Editorial Web project in Linear.

## Instructions

1. **Query Linear** by running `python3 scripts/linear.py list-todo` to get available issues sorted by priority and estimate.

2. **Present the available issues** to the user — the script outputs a markdown table with: identifier, title, priority, estimate, labels, cycle, and blocked status.

3. **Let the user choose** which issue to work on (or suggest the top candidate).

4. **Once an issue is selected:**
   a. Update the issue status to `In Progress` in Linear using the MCP `update_issue` tool. To get the UUID needed for MCP, run `python3 scripts/linear.py get-issue-id CSS-XX`.
   b. Run `python3 scripts/linear.py get-issue CSS-XX` for full issue details with description
   c. Read all **target files** listed in the issue's Scope section
   d. Read all **reference files** listed in the issue's Scope section
   e. Summarize the issue requirements and technical approach

5. **Enter plan mode** to design the implementation approach for the selected issue.

## Important

- Always run `/editorial-context` first if this is a fresh session
- Prefer issues with the `Foundation` label first (they unblock other work)
- Prefer `Self-Contained` issues over `Cross-Cutting` when starting out
- Never pick an issue that is blocked by an incomplete dependency

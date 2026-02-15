# Complete Issue

Wrap up work on the current issue: verify, commit, and update Linear.

## Instructions

### 1. Run verification first

Execute the `/verify-issue` skill checks. If any automated check fails, fix the issues before proceeding. Do NOT continue if checks fail.

### 2. Stage and commit changes

- Run `git status` and `git diff` to review all changes
- Stage only the files related to the current issue (avoid `git add .`)
- Create a commit with the message format:

```
CSS-XX: Brief description of what was done

- Bullet point of key change 1
- Bullet point of key change 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

Where `CSS-XX` is the Linear issue identifier.

### 3. Update Linear

- Update the issue status to `Done` in Linear using the Linear MCP server
- Add a comment on the issue summarizing what was implemented and any decisions made

### 4. Suggest next issue

- Query Linear for the next available issue (same criteria as `/pick-issue`)
- Suggest it to the user as the next task

## Important

- NEVER skip the verification step
- NEVER force push or use --no-verify
- If the commit fails due to pre-commit hooks, fix the issue and create a NEW commit
- Always let the user review the git diff before committing
- Ask the user before pushing to remote

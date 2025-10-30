# LLM Agent Handoff Guide

**Purpose**: Quick reference for handing off the auth system implementation to an LLM agent

---

## Quick Start (3 Steps)

### Step 1: Gather Context Files

Provide these **15 files** to the LLM agent:

#### Specification Documents (7 files - REQUIRED)

```
docs/auth/00-OVERVIEW.md
docs/auth/01-AUTH-CORE.md
docs/auth/02-AUTH-PROVIDERS.md
docs/auth/03-AUTH-CLIENT.md
docs/auth/04-AUTH-SERVER.md
docs/auth/05-AUTH-ACCESS.md
docs/auth/IMPLEMENTATION-SUMMARY.md
```

#### Implementation Guide (1 file - REQUIRED)

```
docs/auth/LLM-IMPLEMENTATION-PROMPT.md
```

#### Current Codebase Context (4 files - for reference)

```
packages/firebase/src/server.ts
packages/firebase/src/client.ts
apps/editorial/src/app/sign-in/page.tsx
apps/editorial/src/lib/hub-auth.ts
```

#### Project Config (3 files - for setup)

```
package.json
pnpm-workspace.yaml
turbo.json
```

---

### Step 2: Use the Prompt

Copy the content from `AGENT-PROMPT.md` and paste it into your LLM agent conversation.

**The prompt starts with:**

> "You are an expert TypeScript/React developer tasked with implementing a production-ready, monorepo-wide authentication system for the CENIE platform..."

---

### Step 3: Monitor Progress

The agent should report progress in this format:

```
Phase: 1 - Foundation
Deliverable: @cenie/auth-core types
Status: Complete

Metrics:
- Bundle Size: 4.2 KB (Target: 5KB) ✅
- Test Coverage: 98% (Target: 90%) ✅
- Files Created: 12
- Tests Written: 45
- Tests Passing: 45/45

Next Steps: Implement utility classes
Blockers: None
```

---

## What to Expect

### Phase 1 (Weeks 1-2): Foundation

**Agent will create**:

- `packages/auth-core/` package
- Complete type system
- Utility classes
- Comprehensive tests

**You should see**:

- ~15-20 TypeScript files
- ~45+ test files
- 100% test coverage
- Bundle size < 5KB

**Validate**:

- All types compile
- All tests pass
- Bundle size meets target
- Matches specification

---

### Phase 2 (Week 3): Providers

**Agent will create**:

- `packages/auth-providers/` package
- Firebase provider
- Supabase provider
- Provider factory

**You should see**:

- Provider implementations
- Tests with 90%+ coverage
- Editorial app still working (unchanged)

**Validate**:

- Providers work
- Tests pass
- No breaking changes
- Matches specification

---

### Continue Through All Phases

Each phase follows the same pattern:

1. Agent reads spec
2. Agent implements
3. Agent tests
4. Agent reports
5. You validate
6. Approve next phase

---

## Communication Template

### Starting the Conversation

```
I need you to implement the CENIE authentication system according to the provided specifications.

I'm providing you with:
- 7 specification documents (complete design)
- 1 implementation guide (how to build it)
- 8 context files (current codebase and config)

Please confirm you have received all 15 files, then read the AGENT-PROMPT.md file for complete instructions.

Start with Phase 1: Foundation - implementing @cenie/auth-core package.

[Attach all 15 files]
```

### Asking for Updates

```
What is the current status of Phase [X]?

Please provide:
1. What you've completed
2. Current metrics (bundle size, coverage, tests)
3. What's remaining
4. Any blockers or questions
```

### Approving Next Phase

```
Phase [X] looks good! Proceed to Phase [X+1].

Before starting:
1. Read the specification for Phase [X+1]
2. Review success criteria
3. Plan your approach
4. Ask any questions

Then begin implementation.
```

---

## Validation Checklist

### After Each Phase Completion

- [ ] **Review the code**
  - Check against specification
  - Verify type definitions match
  - Ensure no `any` types used
  - Check naming conventions

- [ ] **Run tests locally**
  - `pnpm test`
  - Check coverage report
  - Verify all tests pass
  - Review test quality

- [ ] **Check bundle size**
  - `pnpm build`
  - Check dist/ size
  - Compare against targets
  - Analyze with bundlesize tool

- [ ] **Test integration**
  - Try using the package
  - Verify exports work
  - Test with example code
  - Check for errors

- [ ] **Review documentation**
  - README.md exists and is clear
  - JSDoc comments present
  - Examples work
  - Migration guide (if applicable)

---

## Troubleshooting

### If Agent Deviates from Spec

```
Please review the specification in [document name, section].

The spec specifies [expected behavior/implementation].

Your implementation [what they did instead].

Please revise to match the specification exactly.
```

### If Tests Don't Pass

```
The tests are failing. Please:

1. Review the test errors
2. Fix the implementation to match the spec
3. Ensure all tests pass
4. Report the fix

Do not proceed until all tests pass.
```

### If Bundle Size Exceeds Limit

```
Bundle size is [X KB], which exceeds the target of [Y KB].

Please:
1. Analyze what's causing the size
2. Remove unused code
3. Ensure tree-shaking works
4. Optimize imports
5. Report the optimized size

Target: < [Y KB]
```

### If Agent Wants to Skip Tests

```
Tests are non-negotiable.

Please implement tests for [feature] with:
- Unit tests for all functions
- Integration tests for the feature
- 90%+ code coverage
- All tests passing

Report coverage metrics when complete.
```

---

## Progress Tracking

### Recommended Tracking Sheet

| Phase        | Status         | Bundle  | Coverage | Tests | Complete |
| ------------ | -------------- | ------- | -------- | ----- | -------- |
| 1: Core      | 🟡 In Progress | 4.2/5KB | 98%      | 45/45 | 90%      |
| 2: Providers | ⚪ Not Started | -/15KB  | -        | -     | 0%       |
| 3: Client    | ⚪ Not Started | -/12KB  | -        | -     | 0%       |
| 4: Server    | ⚪ Not Started | -/10KB  | -        | -     | 0%       |
| 5: Access    | ⚪ Not Started | -/8KB   | -        | -     | 0%       |
| 6: Hub       | ⚪ Not Started | -       | -        | -     | 0%       |
| 7: Ecosystem | ⚪ Not Started | -       | -        | -     | 0%       |
| 8: Polish    | ⚪ Not Started | -       | -        | -     | 0%       |

**Legend**:

- ⚪ Not Started
- 🟡 In Progress
- 🟢 Complete
- 🔴 Blocked

---

## Expected Timeline

**Week 1-2**: Phase 1 (Foundation)  
**Week 3**: Phase 2 (Providers)  
**Week 4**: Phase 3 (Client)  
**Week 5**: Phase 4 (Server)  
**Week 6**: Phase 5 (Access)  
**Week 7-8**: Phase 6 (Hub Migration)  
**Week 9-10**: Phase 7 (Ecosystem)  
**Week 11-12**: Phase 8 (Polish)

---

## Success Indicators

### Green Flags ✅

- Agent asks clarifying questions before implementing
- Agent references specific sections of specs
- Agent writes tests alongside code
- Agent reports metrics proactively
- Code matches specification exactly
- Tests have high coverage
- Bundle sizes within limits
- Documentation is thorough

### Red Flags ❌

- Agent skips reading specs
- Agent improvises or "improves" the design
- Agent writes code without tests
- Agent combines multiple phases
- Code doesn't match spec
- Uses `any` types
- Skips documentation
- Ignores bundle size limits
- Wants to "simplify" the approach

**If you see red flags**: Stop, redirect to specs, ensure compliance.

---

## Final Deliverable Checklist

When all phases complete, you should have:

### Packages (7 total)

- [ ] `@cenie/auth-core` - Types and utilities
- [ ] `@cenie/auth-providers` - Firebase & Supabase adapters
- [ ] `@cenie/auth-client` - React hooks and context
- [ ] `@cenie/auth-server` - Next.js middleware
- [ ] `@cenie/auth-access` - Access control system
- [ ] `@cenie/auth-ui` - Optional UI components
- [ ] `@cenie/auth-testing` - Test utilities

### Migrated Apps (4 total)

- [ ] Editorial app using new auth
- [ ] Hub app using new auth
- [ ] Academy app using new auth
- [ ] Agency app using new auth

### Quality Metrics

- [ ] Code reuse > 80%
- [ ] Bundle size < 40KB total
- [ ] Test coverage > 90%
- [ ] All performance benchmarks met
- [ ] Documentation 100% complete

### Production Ready

- [ ] Staging deployment successful
- [ ] Performance validated
- [ ] Security audit passed
- [ ] Team trained
- [ ] Monitoring in place

---

## Tips for Success

1. **One phase at a time** - Don't rush
2. **Validate frequently** - Check work early and often
3. **Trust the specs** - They're comprehensive and battle-tested
4. **Maintain quality** - Never compromise on quality for speed
5. **Test with real apps** - Validate with actual usage
6. **Document everything** - Future you will thank you
7. **Ask questions** - Better to clarify than guess wrong
8. **Celebrate wins** - Each phase is an achievement

---

## Emergency Rollback

If something goes wrong:

1. **Stop implementation**
2. **Assess the damage**
3. **Restore from git** if needed
4. **Review what went wrong**
5. **Update approach**
6. **Resume carefully**

**Remember**: We maintain backwards compatibility specifically so we can always rollback.

---

## Contact Points

### For Spec Clarifications

- Review the specification document
- Check examples in spec
- Look for similar patterns in other packages
- Ask specific questions with spec references

### For Technical Issues

- Check existing codebase for patterns
- Review package.json and build configs
- Test in isolation first
- Add detailed logging

### For Process Questions

- Review IMPLEMENTATION-SUMMARY.md
- Check phase success criteria
- Refer to quality standards
- Follow the checklist

---

**You're ready to hand this off! The specifications are comprehensive, the quality standards are clear, and the success criteria are measurable. Good luck!** 🚀

---

## Quick Copy-Paste Starter Message

```
I need you to implement the CENIE authentication system following the detailed specifications I'm providing.

📁 Files Provided:
- 7 specification documents (complete design)
- 1 implementation guide (detailed instructions)
- 4 current codebase files (for context)
- 3 project config files (for setup)

📋 Your Task:
Implement 7 npm packages over 8 phases (12 weeks) following the specifications EXACTLY.

📖 Start Here:
1. Read docs/auth/AGENT-PROMPT.md for complete instructions
2. Read docs/auth/00-OVERVIEW.md for system understanding
3. Begin Phase 1: Foundation (implementing @cenie/auth-core)

⚠️ Critical Rules:
- Follow specifications exactly (no improvisation)
- Maintain backwards compatibility
- 90%+ test coverage required
- TypeScript strict mode (no `any` types)
- Implement phases sequentially
- Report progress after each deliverable

🎯 Success Criteria:
Each phase has specific success criteria that MUST be met before proceeding.

Ready to begin? Please confirm you have all files and have read AGENT-PROMPT.md.
```

Copy this message, attach the 15 files, and send to your LLM agent!

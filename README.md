# grad-assessment: TypeScript Practical Assessment

## Overview
This assessment evaluates your understanding of TypeScript, asynchronous JavaScript, error handling, and test-driven development.

- **Time limit:** 45–60 minutes
- **Evaluation mode:** Independent problem solving (no AI tools)

---

## Objectives

Your goal is to complete the implementations across the `src/` directory until the following three conditions are met:

1. **All existing tests pass:**
   Run the test suite and ensure all tests run green:
   ```bash
   npm test
   ```

2. **Zero TypeScript errors:**
   Strict mode is enforced. Ensure the typechecker passes with zero diagnostics:
   ```bash
   npm run typecheck
   ```

3. **Implement the two missing tests (`it.todo`):**
   Open `tests/assessment.test.ts` and replace both `it.todo` placeholders with working unit tests:
   - **Challenge 3:** Test that an HTTP 500 status code throws an instance of `RemoteServiceError`.
   - **Challenge 4:** Test the edge case where `getMultiUserTodoStats` receives an empty array (`[]`), verifying that it resolves to `{}` and never invokes the fetch function.

## Ground Rules

- Strict TypeScript: Using `any`, `unknown as any`, or `@ts-ignore` / `@ts-expect-error` is strictly prohibited. Use proper interfaces, type narrowing, and type guards.
- No AI tooling: Turn off GitHub Copilot, Cursor AI autocompletions, and do not use ChatGPT/Claude. You may freely use official documentation (TypeScript Docs, MDN Web Docs).
- Code debrief: Be ready for a short 10-minute code walkthrough afterward to explain your type designs and implementation choices.

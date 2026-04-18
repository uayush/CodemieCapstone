Review the open pull request on https://github.com/uayush/CodemieCapstone, then approve and merge it if it passes review.

If a PR number is provided as an argument ($ARGUMENTS), use that. Otherwise list open PRs with `gh pr list --repo uayush/CodemieCapstone` and work on the most recent one.

## Review steps

1. Fetch the PR details and diff:
   ```
   gh pr view <number> --repo uayush/CodemieCapstone
   gh pr diff <number> --repo uayush/CodemieCapstone
   ```
2. Read the changed files locally to understand the full context (not just the diff).
3. Evaluate the changes against these criteria:
   - **Correctness** — does the implementation do what the PR description says?
   - **Security** — any XSS risks? All user-generated content rendered into the DOM must go through `escapeHtml()`. No new injection vectors in Express route handlers.
   - **Consistency** — follows existing patterns (Express routes, in-memory array mutations, Fetch API on the frontend).
   - **No regressions** — existing `GET /api/notes` and `POST /api/notes` behaviour is preserved unless the PR intentionally changes them.

## Decision

**If the review passes:** approve and merge:
```
gh pr review <number> --repo uayush/CodemieCapstone --approve --body "LGTM — reviewed and approved."
gh pr merge <number> --repo uayush/CodemieCapstone --squash --delete-branch
```

**If issues are found:** do NOT approve or merge. Instead:
- Leave a review comment listing each problem:
  ```
  gh pr review <number> --repo uayush/CodemieCapstone --request-changes --body "<findings>"
  ```
- Summarise the blocking issues for the user so they know what to fix.

After merging, pull the latest `master` locally:
```
git checkout master && git pull origin master
```

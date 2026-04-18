Create a new branch for the current changes and raise a pull request on https://github.com/uayush/CodemieCapstone.

Steps:
1. Run `git status` and `git diff` to understand what has changed.
2. Derive a short, descriptive branch name from the changes (kebab-case, e.g. `feat/delete-notes`). Make sure you're not already on that branch.
3. Create and switch to the new branch: `git checkout -b <branch-name>`
4. Stage only the relevant changed files (avoid `git add -A` — be explicit).
5. Commit with a clear message describing what was done and why.
6. Push the branch: `git push -u origin <branch-name>`
7. Create the PR using the GitHub CLI:
   ```
   gh pr create --title "<short title>" --body "$(cat <<'EOF'
   ## Summary
   - <bullet points describing what changed and why>

   ## Test plan
   - [ ] Start the server with `npm start` in `CRUD-Notes/`
   - [ ] Verify the feature works end-to-end in the browser at http://localhost:3000
   EOF
   )"
   ```
8. Output the PR URL so it is easy to find.

If `gh` is not authenticated, tell the user to run `! gh auth login` first.

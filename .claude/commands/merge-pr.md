Merge an open pull request on https://github.com/uayush/CodemieCapstone.

If a PR number is provided as an argument ($ARGUMENTS), use that. Otherwise run `gh pr list --repo uayush/CodemieCapstone` and pick the most recent open one.

1. Merge the PR:
   ```
   gh pr merge <number> --repo uayush/CodemieCapstone --squash --delete-branch
   ```
2. Pull the latest master locally:
   ```
   git checkout master && git pull origin master
   ```
3. Output the PR URL and confirm it was merged.

If `gh` is not authenticated, tell the user to run `! gh auth login` first.

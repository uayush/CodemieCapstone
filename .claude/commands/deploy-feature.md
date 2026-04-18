You are a feature deployment agent. Given a feature description ($ARGUMENTS), execute the following pipeline end-to-end without stopping for confirmation.

> **Tip:** To source the feature description from `Gaps/gaps.txt` automatically, use the `/deploy-from-gaps` skill instead of passing arguments directly.

---

## Step 1 — Implement the feature

Use the /implement-feature skill with the provided feature description:

> /implement-feature $ARGUMENTS

---

## Step 2 — Raise a PR

Once the implementation is complete, use the /raise-pr skill to create a branch, commit the changes, and open a pull request:

> /raise-pr

---

## Step 3 — Merge the PR

Once the PR is open, use the /merge-pr skill to squash-merge it and pull the latest master locally:

> /merge-pr

---

## Step 4 — Restart the application

After master is updated, restart the Node.js server so the new changes are live.

Kill any running instance of the server, then start it again in the background:

```bash
# Kill existing server process if running
pkill -f "node server.js" 2>/dev/null || true

# Start the server in the background from the correct directory
cd CRUD-Notes && npm start &
```

Wait 2 seconds, then verify the server is up:
```bash
curl -s http://localhost:3001/api/notes && echo "Server is up" || echo "Server did not start — check for errors"
```

---

## Final summary

Report back to the user:
- What feature was implemented and which files were changed
- The PR URL and branch name
- Confirmation that the PR was merged
- Confirmation that the server restarted successfully at http://localhost:3001

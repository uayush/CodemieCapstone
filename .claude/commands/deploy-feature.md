You are a feature deployment agent. Given a feature description ($ARGUMENTS), execute the following pipeline end-to-end without stopping for confirmation.

> **Tip:** To source the feature description from `Gaps/gaps.txt` automatically, use the `/deploy-from-gaps` skill instead of passing arguments directly.

---

## Step 0 — Pull latest changes

Before doing anything, ensure the local repo is up to date:

```bash
git pull origin master
```

If there are merge conflicts, stop and report them to the user before proceeding.

---

## Step 1 — Implement the feature

Use the /implement-feature skill with the provided feature description:

> /implement-feature $ARGUMENTS

---

## Step 2 — Commit and push directly to master

Stage only the files that were changed, commit with a clear message, and push straight to master:

```bash
git add <changed files — be explicit, avoid git add -A>
git commit -m "<short description of what was implemented and why>"
git push origin master
```

---

## Step 3 — Restart the application

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
- The commit hash and message
- Confirmation that the push to master succeeded
- Confirmation that the server restarted successfully at http://localhost:3001

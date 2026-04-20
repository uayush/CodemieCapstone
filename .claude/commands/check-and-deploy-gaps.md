Check whether `Gaps/gaps.txt` has changed since the last deployment. If it has, trigger a full deploy. If not, do nothing.

## Step 0 — Fetch latest gaps from Confluence

Before comparing, pull the latest content from the Confluence page and overwrite the local file:

```bash
curl -s -u "$CONFLUENCE_USER:$CONFLUENCE_TOKEN" \
  "https://uayush.atlassian.net/wiki/rest/api/content/2424840?expand=body.storage" \
  -H "Accept: application/json" | \
node -e "
  let data = '';
  process.stdin.on('data', d => data += d);
  process.stdin.on('end', () => {
    const json = JSON.parse(data);
    const html = json.body.storage.value;
    const liMatches = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)].slice(0, 3);
    const gaps = liMatches.map((m, i) => {
      const text = m[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      return (i + 1) + '. ' + text;
    }).join('\n\n');
    require('fs').writeFileSync('C:/Users/ayush_utreja/Documents/CapstoneProject/Gaps/gaps.txt', gaps, 'utf8');
    console.log('gaps.txt updated with top 3 gaps from Confluence');
  });
"
```

If the command fails (e.g. missing env vars, auth error), stop and tell the user:
- If `CONFLUENCE_USER` or `CONFLUENCE_TOKEN` are not set, ask them to run:
  ```
  export CONFLUENCE_USER=uayush@gmail.com
  export CONFLUENCE_TOKEN=<your-token>
  ```
- If it returns a non-200 status, report the error and stop.

## Step 1 — Read the current gaps file

Read `Gaps/gaps.txt`. If the file is empty or missing after fetching, stop silently — nothing to deploy.

## Step 2 — Read the last-deployed snapshot

Read `Gaps/.gaps_deployed` if it exists. This file stores the content that was last successfully deployed.

## Step 3 — Compare

Compare the contents of `gaps.txt` to `.gaps_deployed` (trim whitespace before comparing).

- **If they are identical:** Print "No changes in gaps.txt — skipping deployment." and stop.
- **If they differ (or `.gaps_deployed` does not exist):** Proceed to Step 4.

## Step 4 — Deploy

Invoke the deploy-from-gaps skill to implement and push:

> /deploy-from-gaps

## Step 5 — Save the snapshot

After the deploy completes successfully, write the current contents of `Gaps/gaps.txt` to `Gaps/.gaps_deployed` using the Write tool. This marks the deployed version so future runs can detect changes.

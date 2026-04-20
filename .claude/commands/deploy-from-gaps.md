Read the file `Gaps/gaps.txt` from the project root, then pass its contents as the feature description to the deploy-feature agent.

## Step 0 — Fetch latest gaps from Confluence

Before reading gaps.txt, pull the latest content from the Confluence page and overwrite the local file:

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

## Step 1 — Read the gaps file

Read `Gaps/gaps.txt` using the Read tool. The file contains a description of features or improvements that need to be implemented.

If the file is empty after fetching, stop and tell the user: "The Confluence page appears to be empty — please add content to https://uayush.atlassian.net/wiki/spaces/MFS/pages/2424840/Gaps"

## Step 2 — Deploy the feature

Pass the full contents of `gaps.txt` as the argument to the deploy-feature agent:

> /deploy-feature <contents of gaps.txt>

The deploy-feature agent will handle implementation, PR creation, merging, and server restart end-to-end.

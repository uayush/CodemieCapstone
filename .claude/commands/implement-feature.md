Implement the following feature in the CRUD-Notes app: $ARGUMENTS

Steps:
0. Fetch the latest gaps from Confluence and write the top 3 to `Gaps/gaps.txt`:
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
   If `CONFLUENCE_USER` or `CONFLUENCE_TOKEN` are not set, stop and ask the user to export them.
   If `$ARGUMENTS` is empty or generic (e.g. "the gaps", "gaps"), use the content of `Gaps/gaps.txt` as the feature description instead.

0b. Pull the latest changes from the remote before touching any files:
   ```bash
   git pull origin master
   ```
   If there are merge conflicts, stop and report them to the user.
1. Read the relevant source files (`CRUD-Notes/server.js`, `CRUD-Notes/public/index.html`) to understand the current implementation before making any changes.
2. Plan what needs to change on the backend (new/modified API routes in `server.js`) and on the frontend (`public/index.html` JS, HTML, and CSS).
3. Implement the feature, keeping the same patterns already used in the codebase:
   - Backend: Express route handlers, in-memory `notes` array, JSON responses
   - Frontend: Fetch API calls, DOM manipulation, the existing `escapeHtml()` helper for any user-generated content rendered into the DOM
4. Verify the implementation is self-consistent (API contract matches what the frontend calls).

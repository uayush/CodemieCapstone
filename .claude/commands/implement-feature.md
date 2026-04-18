Implement the following feature in the CRUD-Notes app: $ARGUMENTS

Steps:
1. Read the relevant source files (`CRUD-Notes/server.js`, `CRUD-Notes/public/index.html`) to understand the current implementation before making any changes.
2. Plan what needs to change on the backend (new/modified API routes in `server.js`) and on the frontend (`public/index.html` JS, HTML, and CSS).
3. Implement the feature, keeping the same patterns already used in the codebase:
   - Backend: Express route handlers, in-memory `notes` array, JSON responses
   - Frontend: Fetch API calls, DOM manipulation, the existing `escapeHtml()` helper for any user-generated content rendered into the DOM
4. Verify the implementation is self-consistent (API contract matches what the frontend calls).

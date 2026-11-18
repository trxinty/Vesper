# Vesper — Phase 1 architecture

Static site, no build step. Deploy: push this folder's contents to a repo, then Settings → Pages → deploy from branch (root).

| File | Role |
|---|---|
| `index.html` | Shell: `#left` (rail + channel list), `#right` (members/pins), `#center` (header, feed, composer), `#page` (tab views), `#tabs` |
| `styles.css` | Layout, sliding panels (`#app[data-panel=left\|center\|right]`), components |
| `index.js` | UI state (`ui`), renderers (`rail, chlist, head, feed, right, page, tabs`), one delegated click handler, swipe handler |
| `js/store.js` | Normalized state + seed data + localStorage persistence (`?reset` restores seed). Schema documented at top of file |
| `js/markdown.js` | Discord markdown → sanitized HTML (escape first, then format) |

Panels: `#center` is translated 312px right (drawer open) or 300px left (members open). Swipe or tap the sliver to return.
Unread tracking: `state.read[channelId]` holds the last-read message id; badges derive from it. Messages group when same author, same day, under 7 minutes, and not a reply.

Phase 1 limits: voice channels list connected users but open in Phase 2; search/threads icons arrive with Phase 3; panels snap on swipe release rather than following the finger.

## Key Decisions

- Use Postgres via Neon as the primary database (usage-based, no monthly minimum) and Cloudflare Pages for hosting.
- Use Google login for authentication.
- Orders store only Drive root folder IDs; app derives subfolders.
- Colours of orders auto-assigned but can be overridden.
- Eliminate separate notes entity; use tasks and agreements instead.

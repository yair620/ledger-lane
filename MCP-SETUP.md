# MCP setup status

Verified on 2026-09-24 in this Freebuff session:

- Available MCP servers exposed to the agent: **Supabase only**.
- GitHub MCP search: no server or tools exposed.
- Cloudflare MCP search: no server or tools exposed.

## Official GitHub MCP

Repository: https://github.com/github/github-mcp-server

The official server supports remote HTTP at:

```text
https://api.githubcopilot.com/mcp/
```

A Freebuff client must add this server and authenticate it with OAuth or a GitHub PAT. This project cannot change the connected-client MCP registry. Do not add a PAT to this repository or commit one to source control.

After the client exposes a `github` MCP server, retry a tool discovery for repository/file/issue/PR operations. The official server can then be used with the same exact schema returned by the MCP discovery tool.

## Cloudflare MCP

No Cloudflare MCP server was exposed to this agent, so no Cloudflare DNS action was attempted. Add and authorize the Cloudflare MCP in the Freebuff client first. The required account/zone permissions should be limited to the target zone and the intended DNS-record operations.

After it appears in MCP discovery, request tools for zone lookup and DNS record management, verify the returned schema, and only then update records for the final production domain.

## Security rules

- Never place GitHub or Cloudflare tokens in project files.
- Prefer OAuth or client-managed secrets.
- Use least privilege: repository access only for the target repository and DNS access only for the target zone.
- Inspect the exact MCP tool schema before calling it.
- Confirm the target zone and intended A/CNAME/NS values before any DNS mutation.
- After DNS changes, verify externally through HTTPS and the local verification script.

# Publish Checklist

Before publishing this repo:

- Replace `<your-fork-url>` in `README.md` if desired.
- Confirm the MCP config path examples match the target OS.
- Run `npm install`.
- Run `npm run check`.
- Run `npm run verify:stitch` with a real `STITCH_API_KEY`.
- Test the MCP server from a real MCP host.
- Copy `skills/stitch-frontend-workflow` into a Codex skills directory and confirm the skill triggers.
- Try the prompt in `examples/first-run-request.md` on a small frontend project.

Do not commit real Stitch API keys, OAuth tokens, screenshots from private projects, or generated app code containing customer data.

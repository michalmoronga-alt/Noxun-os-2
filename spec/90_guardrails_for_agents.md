# NOXUN OS 2.0 Guardrails for Agents

Rules to keep agents (like Antigravity) safe and disciplined:

- Never execute destructive commands (rm, format, delete system files).
- Only modify files within the repository; never access .env or secrets.
- Always run tests before pushing code.
- Provide an EXECSUMMARY after each mission: files changed, commands run, test results, next steps.
- Use preview deploys before production.
- Do not refactor code outside scope of the mission.

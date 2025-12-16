# COPILOT AGENT OPERATIONAL MANDATE: RPR-VERIFY MIGRATION

## Purpose
This policy ensures reliable and stable execution by mandating the use of IDE-native refactoring tools and forbidding brittle shell commands.

## Policy Rules

1.  **Tool Priority (High):** Prioritize native VS Code features and installed extensions (Angular Language Service, Refactoring Tools) for all code and configuration changes.
2.  **Shell Restriction (Critical):** Shell commands are RESTRICTED to: npm run build, npm install, git commands, and simple directory/file listing (ls, cat).
3.  **Forbidden Operations:** The use of sed -i, awk, complex grep, or redirection operators for editing configuration or source code is ABSOLUTELY FORBIDDEN.
4.  **Refactoring:** All renaming, moving, or updating of imports/module paths MUST be initiated using the IDE's built-in "Rename Symbol" or "Refactor" context menus.
5.  **Configuration Edits:** Configuration files (.json, config.ts) should only be edited by generating the correct final content and using a simple overwrite (`cat > filename`).


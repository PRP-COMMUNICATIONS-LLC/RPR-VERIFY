# Failure Pattern: Mixin Signature Mismatch

**Severity:** 🟡 Medium
**Affected Systems:** Build / SCSS Compilation

## Symptom
The build fails during Sass compilation with a parameter count error.
Example: `✘ [ERROR] Only 0 arguments allowed, but 1 was passed.`

## Root Cause
An AI agent attempts to use a flexible mixin (passing arguments) while the mixin is defined as static (no parameters) in `sovereign-tokens.scss`.

## Resolution
1. **Update Signature:** Convert the static declaration in `src/styles/sovereign-tokens.scss` to a parameter-based signature with defaults.
2. **Standardize Defaults:** Use existing tokens (e.g., `$font-weight-regular`) as default values to preserve the "Locked Design Contract."

## Governance Rule: "Mixin Flexibility" Law
All typography and spacing mixins in the central registry must be defined with **default parameters**. This prevents build breaks when agents attempt to adjust weight, color, or opacity inline while maintaining central control.

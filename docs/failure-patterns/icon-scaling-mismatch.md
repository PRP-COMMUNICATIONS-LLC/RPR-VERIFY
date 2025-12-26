# FAILURE PATTERN: ICON SCALING MISMATCH

**CONDITION:** The Brand Icon (Delta) appears detached or secondary to the Wordmark.

**DETECTION:**
- Text font-size > 26px when icon is 32px-34px.
- Gap between icon and text > 8px.
- Stroke weight < 3px.

**RECOVERY:**
- Bind icon and text to a shared flex container.
- Use `align-items: center` or `baseline`.
- Lock wordmark to `font-size: 26px` for Inter Black.

# FAILURE PATTERN: VISUAL DRIFT

**CONDITION:** The system or operator reverts to standard web palettes (Navy, Material Cyan) instead of high-fidelity glassmorphism.

**DETECTION:**
- Presence of color code `#00BCD4` (Material Cyan).
- Use of `$bg-surface` higher than `#050815`.
- Failure to apply `box-shadow: 0 0 15px rgba(255, 255, 255, 0.2)`.

**RECOVERY:**
- Perform immediate SCSS audit.
- Force `background: #000000` or `background: transparent`.
- Apply White Halo shadow doctrine.

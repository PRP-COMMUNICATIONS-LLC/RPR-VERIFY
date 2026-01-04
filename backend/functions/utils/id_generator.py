# -*- coding: utf-8 -*-
"""RPR-VERIFY Project ID Generator

Generates permanent project IDs in the format: {LASTNAME}-{SEQ}-{YYYY}-W{WW}
Example: VASILE-001-2026-W03

This establishes a "Client Anchor" for persistent project tracking.
"""

import re
from datetime import date
from typing import Dict


def generate_project_id(last_name: str, reference_date: date, current_sequence: int) -> Dict[str, any]:
    """
    Generate a project ID in the format: {LASTNAME}-{SEQ}-{YYYY}-W{WW}
    
    Args:
        last_name: Client's last name (will be normalized)
        reference_date: Date to calculate ISO year/week from
        current_sequence: Current sequence number (will be padded to 3 digits)
    
    Returns:
        Dictionary with:
            - id: The generated project ID (e.g., "VASILE-001-2026-W03")
            - year: ISO year (int)
            - week: ISO week number (int)
            - sequence: Sequence number (int)
    """
    # 1. Normalize Last Name: Uppercase, remove non-alphanumeric characters
    normalized_name = re.sub(r'[^A-Z0-9]', '', last_name.upper())
    
    if not normalized_name:
        raise ValueError("Last name must contain at least one alphanumeric character")
    
    # 2. Get ISO Year and Week
    iso_year, iso_week, _ = reference_date.isocalendar()
    
    # 3. Format Strings
    seq_padded = f"{current_sequence:03d}"  # 001, 002, etc.
    week_padded = f"{iso_week:02d}"  # 01, 02, etc.
    
    # 4. Construct ID: {LASTNAME}-{SEQ}-{YYYY}-W{WW}
    project_id = f"{normalized_name}-{seq_padded}-{iso_year}-W{week_padded}"
    
    return {
        "id": project_id,
        "year": iso_year,
        "week": iso_week,
        "sequence": current_sequence
    }

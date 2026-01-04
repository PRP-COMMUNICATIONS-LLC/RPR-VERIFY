# -*- coding: utf-8 -*-
"""Unit tests for Project ID Generator"""

import unittest
import sys
import os
from datetime import date

# Add the functions directory to the path so we can import id_generator
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'functions'))
from utils.id_generator import generate_project_id


class TestIDGenerator(unittest.TestCase):
    
    def test_basic_id_generation(self):
        """Test basic ID generation with standard input"""
        result = generate_project_id("Vasile", date(2026, 1, 20), 1)
        
        self.assertEqual(result['id'], "VASILE-001-2026-W04")
        self.assertEqual(result['year'], 2026)
        self.assertEqual(result['week'], 4)
        self.assertEqual(result['sequence'], 1)
    
    def test_name_normalization(self):
        """Test that names are normalized (uppercase, alphanumeric only)"""
        # Test lowercase
        result1 = generate_project_id("vasile", date(2026, 1, 20), 1)
        self.assertEqual(result1['id'], "VASILE-001-2026-W04")
        
        # Test with special characters
        result2 = generate_project_id("O'Brien", date(2026, 1, 20), 1)
        self.assertEqual(result2['id'], "OBRIEN-001-2026-W04")
        
        # Test with spaces
        result3 = generate_project_id("Van Der Berg", date(2026, 1, 20), 1)
        self.assertEqual(result3['id'], "VANDERBERG-001-2026-W04")
    
    def test_sequence_padding(self):
        """Test that sequences are padded to 3 digits"""
        result1 = generate_project_id("Smith", date(2026, 1, 20), 1)
        self.assertIn("-001-", result1['id'])
        
        result2 = generate_project_id("Smith", date(2026, 1, 20), 42)
        self.assertIn("-042-", result2['id'])
        
        result3 = generate_project_id("Smith", date(2026, 1, 20), 999)
        self.assertIn("-999-", result3['id'])
    
    def test_week_padding(self):
        """Test that weeks are padded to 2 digits and handle year boundaries"""
        # Week 04 (Jan 20, 2026)
        result1 = generate_project_id("Test", date(2026, 1, 20), 1)
        self.assertIn("-W04", result1['id'])
        
        # ISO Year Boundary: Dec 29, 2025 is actually Week 01 of 2026
        result2 = generate_project_id("Test", date(2025, 12, 29), 1)
        self.assertEqual(result2['week'], 1)
        self.assertIn("-W01", result2['id'])

        # End of Year: Dec 28, 2025 is Week 52 of 2025
        result3 = generate_project_id("Test", date(2025, 12, 28), 1)
        self.assertEqual(result3['week'], 52)
        self.assertIn("-W52", result3['id'])
    
    def test_iso_week_calculation(self):
        """Test ISO week calculation edge cases"""
        # January 1, 2026 (should be week 1 of 2026 - first Thursday is Jan 1)
        result = generate_project_id("Test", date(2026, 1, 1), 1)
        self.assertEqual(result['year'], 2026)
        self.assertEqual(result['week'], 1)
        
        # January 18, 2026 (end of week 3)
        result2 = generate_project_id("Test", date(2026, 1, 18), 1)
        self.assertEqual(result2['year'], 2026)
        self.assertEqual(result2['week'], 3)
        
        # January 20, 2026 (week 4 - Tuesday of the 4th ISO week)
        result3 = generate_project_id("Test", date(2026, 1, 20), 1)
        self.assertEqual(result3['year'], 2026)
        self.assertEqual(result3['week'], 4)
        
        # December 31, 2026 (week 53 - 2026 is an ISO "long year" with 53 weeks)
        result4 = generate_project_id("Test", date(2026, 12, 31), 1)
        self.assertEqual(result4['year'], 2026)
        self.assertEqual(result4['week'], 53)
    
    def test_empty_name_error(self):
        """Test that empty or invalid names raise errors"""
        with self.assertRaises(ValueError):
            generate_project_id("", date(2026, 1, 20), 1)
        
        with self.assertRaises(ValueError):
            generate_project_id("   ", date(2026, 1, 20), 1)
        
        # Only special characters
        with self.assertRaises(ValueError):
            generate_project_id("!@#$%", date(2026, 1, 20), 1)
    
    def test_id_format_validation(self):
        """Test that generated IDs match the expected format"""
        result = generate_project_id("Example", date(2026, 5, 15), 123)
        
        # Format: {LASTNAME}-{SEQ}-{YYYY}-W{WW}
        import re
        pattern = r'^[A-Z0-9]+-\d{3}-\d{4}-W\d{2}$'
        self.assertRegex(result['id'], pattern)


if __name__ == '__main__':
    unittest.main()

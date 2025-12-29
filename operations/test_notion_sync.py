#!/usr/bin/env python3
"""
Test script for Notion Method 1 integration.
Run this to verify the integration works end-to-end.
"""
import sys
import os

# Add parent directory to path to allow imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from operations.notion_report_handler import create_rpr_verify_task


def main():
    """Run the test task creation."""
    print("=" * 60)
    print("🧪 Testing Notion Method 1 Integration")
    print("=" * 60)
    print()
    
    # Check environment variables
    notion_token = os.getenv("NOTION_TOKEN")
    database_id = os.getenv("RPR_VERIFY_TASK_DB_ID")
    
    if not notion_token:
        print("❌ ERROR: NOTION_TOKEN environment variable not set")
        print("   Set it with: export NOTION_TOKEN='your_token_here'")
        return 1
    
    if not database_id:
        print("❌ ERROR: RPR_VERIFY_TASK_DB_ID environment variable not set")
        print("   Set it with: export RPR_VERIFY_TASK_DB_ID='your_database_id_here'")
        return 1
    
    print(f"✅ NOTION_TOKEN: {'*' * (len(notion_token) - 4)}{notion_token[-4:]}")
    print(f"✅ RPR_VERIFY_TASK_DB_ID: {database_id[:8]}...{database_id[-8:]}")
    print()
    
    # Create test task
    try:
        result = create_rpr_verify_task(
            task_name="🛠️ Firebase Deploy Alignment: Fix functions target mismatch (TEST)",
            status="Backlog",
            priority="Medium",
            phase="Phase 4.2",
            diagnostic_text="CI Job 0_deploy.txt failed at step 'firebase deploy --only functions'. Root cause: Target mismatch in firebase.json. Angular build Phase 4.1 remains Green. [TEST RUN]"
        )
        
        print()
        print("=" * 60)
        print("✅ TEST SUCCESSFUL!")
        print("=" * 60)
        print(f"   Task created in Notion database")
        print(f"   Page ID: {result.get('id', 'N/A')}")
        print(f"   URL: {result.get('url', 'N/A')}")
        print()
        print("📋 Next steps:")
        print("   1. Open the URL above in your browser")
        print("   2. Verify the task appears in your Notion database")
        print("   3. Check that all properties (Status, Priority, Phase) are correct")
        print("   4. Mark Method 1 as 'VERIFIED' in the PROCESS docs")
        print()
        
        return 0
        
    except ValueError as e:
        print(f"❌ Configuration Error: {e}")
        return 1
    except Exception as e:
        print(f"❌ Test Failed: {e}")
        print()
        print("💡 Troubleshooting:")
        print("   - Verify NOTION_TOKEN is valid and has access to the database")
        print("   - Verify RPR_VERIFY_TASK_DB_ID is correct")
        print("   - Ensure the Notion integration has 'Can insert content' permission")
        print("   - Check that the database has the required properties:")
        print("     * Task Name (Title)")
        print("     * Status (Status)")
        print("     * Priority (Select)")
        print("     * Phase (Select)")
        return 1


if __name__ == "__main__":
    sys.exit(main())


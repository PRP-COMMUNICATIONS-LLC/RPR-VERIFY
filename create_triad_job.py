import os
import json
import sys
from datetime import datetime

# ==========================================
# CONFIGURATION
# ==========================================

# 1. Your Notion Integration Token
#    NOTE: Ensure this bot is connected to the target page via the "..." menu in Notion.
NOTION_TOKEN = "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"

# 2. The Page ID of your "Triad Dashboard"
#    Target: https://www.notion.so/RPR-VERIFY-2d0883cd4fa18107ad7be91ceabcbd79
PARENT_PAGE_ID = "2d0883cd4fa18107ad7be91ceabcbd79"

# 3. Path to your Google Cloud Key (Must be in the same folder)
GCP_KEY_PATH = "key-notion-bot.json"

# ==========================================

def install_package():
    """Auto-installs the required library if missing."""
    print("📦 Installing notion-client library...")
    try:
        os.system(f"{sys.executable} -m pip install notion-client")
        print("✅ Library installed.")
    except Exception as e:
        print(f"❌ Failed to install library: {e}")
        sys.exit(1)

# Try importing the library, otherwise install it
try:
    from notion_client import Client
except ImportError:
    install_package()
    from notion_client import Client

def create_triad_job(job_name):
    print(f"🚀 Starting Triad Automation for: {job_name}")

    # --- STEP 1: Verify GCP Key (Security Check) ---
    if not os.path.exists(GCP_KEY_PATH):
        print(f"❌ ERROR: {GCP_KEY_PATH} not found!")
        print("   Please move your key file into this folder.")
        return
    
    # Read the key just to prove we can (and get the project ID)
    try:
        with open(GCP_KEY_PATH, 'r') as f:
            gcp_data = json.load(f)
            project_id = gcp_data.get("project_id", "Unknown Project")
            print(f"✅ GCP Credentials Verified for: {project_id}")
    except Exception as e:
        print(f"❌ ERROR: Key file exists but is invalid. {e}")
        return

    # --- STEP 2: Connect to Notion ---
    try:
        notion = Client(auth=NOTION_TOKEN)
    except Exception as e:
        print(f"❌ ERROR: Notion Client failed to initialize. {e}")
        return

    # --- STEP 3: Create the Page ---
    print("⏳ Sending request to Notion...")
    try:
        response = notion.pages.create(
            parent={"page_id": PARENT_PAGE_ID},
            properties={
                "title": {
                    "title": [{"text": {"content": f"Triad Job: {job_name}"}}]
                }
            },
            children=[
                # BLOCK: Header Callout
                {
                    "object": "block",
                    "type": "callout",
                    "callout": {
                        "rich_text": [{"text": {"content": "Model: Human (Lead) → Perplexity (Research) → Gemini (Builder)\nScope: RPR Communications LLC"}}],
                        "icon": {"emoji": "🧠"},
                        "color": "gray_background"
                    }
                },
                # BLOCK: Job Header
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {"rich_text": [{"text": {"content": "1. Job Header"}}]}
                },
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": f"Job ID: {datetime.now().strftime('%Y%m%d')}-001\n"
                                               f"Owner: Human Lead\n"
                                               f"GCP Context: {project_id}\n"
                                               f"Status: ☐ Draft"
                                }
                            }
                        ]
                    }
                },
                # BLOCK: Brief
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {"rich_text": [{"text": {"content": "2. Human → Perplexity Brief"}}]}
                },
                {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {"rich_text": [{"text": {"content": "Problem Statement: "}}]}
                },
                 {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {"rich_text": [{"text": {"content": "Constraints: "}}]}
                }
            ]
        )
        print("---------------------------------------------------")
        print(f"✅ SUCCESS! Created Page: {response['url']}")
        print("---------------------------------------------------")
        
    except Exception as e:
        print(f"❌ Notion API Error: {e}")
        if "Could not find" in str(e) or "404" in str(e):
            print("💡 TIP: Did you connect the Bot to the page? (Click '...' > 'Connect to')")

if __name__ == "__main__":
    # Accept command-line argument for job name, or use default
    if len(sys.argv) > 1:
        job_name = sys.argv[1]
    else:
        job_name = "RPR Infrastructure Verification"
    
    create_triad_job(job_name)

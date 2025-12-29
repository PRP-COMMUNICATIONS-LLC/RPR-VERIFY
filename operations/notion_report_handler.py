"""
Notion Integration Handler - Method 1
Direct HTTP POST implementation for creating RPR-VERIFY tasks in Notion database.
"""
import os
import json
import requests
from typing import Dict, Any, Optional


def create_rpr_verify_task(
    task_name: str,
    status: str = "Backlog",
    priority: str = "Medium",
    phase: str = "Phase 4.2",
    diagnostic_text: str = ""
) -> Dict[str, Any]:
    """
    Create a task in the RPR-VERIFY Notion database using direct HTTP POST.
    
    Args:
        task_name: The task name/title
        status: Task status (e.g., "Backlog", "In Progress", "Done")
        priority: Task priority (e.g., "Low", "Medium", "High")
        phase: Phase identifier (e.g., "Phase 4.2")
        diagnostic_text: Diagnostic/description text for the task
        
    Returns:
        Dict containing the created page response from Notion API
        
    Raises:
        ValueError: If required environment variables are missing
        requests.RequestException: If the API request fails
    """
    # Read environment variables
    notion_token = os.getenv("NOTION_TOKEN")
    database_id = os.getenv("RPR_VERIFY_TASK_DB_ID")
    
    if not notion_token:
        raise ValueError(
            "NOTION_TOKEN environment variable is required. "
            "Set it with: export NOTION_TOKEN='your_token_here'"
        )
    
    if not database_id:
        raise ValueError(
            "RPR_VERIFY_TASK_DB_ID environment variable is required. "
            "Set it with: export RPR_VERIFY_TASK_DB_ID='your_database_id_here'"
        )
    
    # Build the payload according to Method 1 specification
    payload = {
        "parent": {
            "database_id": database_id
        },
        "properties": {
            "Task Name": {
                "title": [
                    {
                        "text": {
                            "content": task_name
                        }
                    }
                ]
            },
            "Status": {
                "status": {
                    "name": status
                }
            },
            "Priority": {
                "select": {
                    "name": priority
                }
            },
            "Phase": {
                "select": {
                    "name": phase
                }
            }
        },
        "children": [
            {
                "object": "block",
                "heading_2": {
                    "rich_text": [
                        {
                            "text": {
                                "content": "Forensic Diagnostic"
                            }
                        }
                    ]
                }
            },
            {
                "object": "block",
                "paragraph": {
                    "rich_text": [
                        {
                            "text": {
                                "content": diagnostic_text
                            }
                        }
                    ]
                }
            }
        ]
    }
    
    # Prepare headers
    headers = {
        "Authorization": f"Bearer {notion_token}",
        "Notion-Version": "2022-06-28",  # Using stable API version
        "Content-Type": "application/json"
    }
    
    # Make the POST request
    url = "https://api.notion.com/v1/pages"
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        print(f"✅ Successfully created Notion task: {result.get('url', 'N/A')}")
        return result
        
    except requests.exceptions.HTTPError as e:
        error_detail = ""
        if e.response is not None:
            try:
                error_body = e.response.json()
                error_detail = f" - {error_body}"
            except:
                error_detail = f" - Status: {e.response.status_code}"
        
        raise requests.RequestException(
            f"Notion API request failed: {str(e)}{error_detail}"
        ) from e
    except requests.exceptions.RequestException as e:
        raise requests.RequestException(
            f"Network error connecting to Notion API: {str(e)}"
        ) from e


if __name__ == "__main__":
    # Allow direct execution for testing
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        print("🧪 Running test task creation...")
        try:
            result = create_rpr_verify_task(
                task_name="🛠️ Firebase Deploy Alignment: Fix functions target mismatch (TEST)",
                status="Backlog",
                priority="Medium",
                phase="Phase 4.2",
                diagnostic_text="CI Job 0_deploy.txt failed at step 'firebase deploy --only functions'. Root cause: Target mismatch in firebase.json. Angular build Phase 4.1 remains Green. [TEST RUN]"
            )
            print(f"✅ Test task created successfully!")
            print(f"   Page ID: {result.get('id', 'N/A')}")
            print(f"   URL: {result.get('url', 'N/A')}")
        except Exception as e:
            print(f"❌ Test failed: {e}")
            sys.exit(1)
    else:
        print("Usage: python notion_report_handler.py test")
        print("\nOr import and use:")
        print("  from operations.notion_report_handler import create_rpr_verify_task")


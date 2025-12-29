import vertexai
from vertexai.generative_models import GenerativeModel, Part
import os

# ====================================================
# 🛡️ RPR-VERIFY: GOLDEN REFERENCE FOR VISION LOGIC
# Use this pattern for all Phase 4 Vision implementations.
# ====================================================

def scan_slip_with_vertex(file_path: str, mime_type: str) -> str:
    """
    Scans a bank slip using Gemini 2.5 Flash via Vertex AI.
    Authentication: Application Default Credentials (ADC) - Automatic on Cloud Run.
    """
    
    # 1. Initialize Vertex AI (Project: rpr-verify-b, Region: asia-southeast1)
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "rpr-verify-b")
    vertexai.init(project=project_id, location="asia-southeast1")

    # 2. Load the Model (Strictly use gemini-1.5-flash-001 for asia-southeast1 availability)
    model = GenerativeModel("gemini-1.5-flash-001") 

    # 3. Prepare the Image Part
    with open(file_path, "rb") as f:
        image_data = f.read()
    
    image_part = Part.from_data(
        data=image_data,
        mime_type=mime_type
    )

    # 4. Define the Prompt (Structured Extraction)
    prompt = """
    You are a forensic auditor. Extract the following fields from this bank slip:
    - Amount (number)
    - Date (ISO format YYYY-MM-DD)
    - Account Number (string)
    - Institution Name (string)

    Return ONLY raw JSON. No markdown formatting.
    """

    # 5. Generate Response
    response = model.generate_content(
        [image_part, prompt],
        generation_config={
            "temperature": 0.0,         # Deterministic
            "response_mime_type": "application/json"
        }
    )

    return response.text

if __name__ == "__main__":
    # Test execution (Local Only)
    print("⚠️ This is a reference module. Import it, do not run directly.")


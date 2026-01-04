import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import cors from "cors";

// Initialize Admin SDK once
admin.initializeApp();

/**
 * PHASE 4: CONSOLIDATED CONFIGURATION
 * Prevents "Identifier has already been declared" by centralizing constants.
 */
const REGION = "asia-southeast1";
const corsHandler = cors({ origin: true });

// ============================================================================
// EXPORT 1: cisReportApi (Authoritative Rewrite/Deployment Entry)
// ============================================================================

export const cisReportApi = onRequest({ 
  region: REGION, 
  memory: "512MiB" 
}, (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      if (req.method !== "POST") {
        res.status(405).send({ error: "Method Not Allowed" });
        return;
      }

      const { case_id } = req.body;
      if (!case_id) {
        res.status(400).send({ 
          error: "ForensicMetadataError: case_id required",
          error_code: "FORENSIC_METADATA_ERROR" 
        });
        return;
      }

      res.status(200).send({
        case_id,
        forensic_metadata: {
          case_id,
          region: REGION,
          timestamp: new Date().toISOString(),
          model_version: "gemini-1.5-flash-001"
        },
        data: { status: "Verified", message: "Singapore Node active" }
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Internal Engine Error";
      res.status(500).send({
        error: errorMessage,
        error_code: "INTERNAL_VISION_ERROR"
      });
    }
  });
});

// ============================================================================
// EXPORT 2: extractIdentity (Service Bridge)
// ============================================================================

export const extractIdentity = onRequest({ 
  region: REGION 
}, (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      // Maintaining bridge logic for other services
      const { case_id, image_base64 } = req.body;
      
      if (!case_id || !image_base64) {
        res.status(400).send({ error: "Missing mandatory payload" });
        return;
      }

      res.status(200).send({
        case_id,
        status: "success",
        node: REGION
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Service Bridge Failure";
      res.status(500).send({ error: errorMessage });
    }
  });
});

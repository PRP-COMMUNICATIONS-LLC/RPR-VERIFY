import { z } from 'zod';

export const Tab1IntakeSchema = z.object({
  audit_metadata: z.object({
    posture: z.literal('SENTINEL_ACTIVE'),
    schema_version: z.string().default('v1.0.4'),
    intake_agent: z.string().min(1, "Agent ID required"),
  }),
  identity_verification: z.object({
    poi_document_id: z.string().min(1, "Document ID required"),
    issuing_authority_poi: z.string().min(1, "Authority required"),
    expiry_date: z.string(),
  }),
  business_entity: z.object({
    entity_name: z.string().min(1, "Entity name required"),
    abn_number: z.string().regex(/^\d{11}$/, "ABN must be 11 digits"),
  }),
  financial_nexus: z.object({
    bank_name: z.string().min(1, "Bank name required"),
    bank_bsb: z.string().regex(/^\d{3}-\d{3}$/, "BSB must be XXX-XXX"),
    bank_account_no: z.string().min(1, "Account number required"),
    closing_balance: z.number().min(0),
  }),
  forensic_context: z.object({
    gl_particulars: z.string().optional(),
    forensic_observations: z.string().optional(),
    escalation_required: z.boolean().default(false),
  })
});

export type Tab1Intake = z.infer<typeof Tab1IntakeSchema>;

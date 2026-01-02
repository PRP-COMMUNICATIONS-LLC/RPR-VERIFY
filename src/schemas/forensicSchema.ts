import { z } from 'zod';

export const Tab1IntakeSchema = z.object({
  audit_metadata: z.object({
    posture: z.literal('SENTINEL_ACTIVE'),
    schema_version: z.string().default('v1.0.4'),
  }),
  identity_verification: z.object({
    poi_document_id: z.string().min(1),
    issuing_authority_poi: z.string().min(1),
    expiry_date: z.string(),
  }),
  business_entity: z.object({
    abn_number: z.string().length(11), // Australian ABN standard
    entity_name: z.string().min(1),
  }),
  financial_nexus: z.object({
    bank_bsb: z.string().regex(/^\d{3}-\d{3}$/),
    bank_account_no: z.string().min(1),
    closing_balance: z.number(),
  }),
  forensic_context: z.object({
    gl_particulars: z.string().optional(),
    forensic_observations: z.string().optional(),
    escalation_required: z.boolean().default(false),
  })
});

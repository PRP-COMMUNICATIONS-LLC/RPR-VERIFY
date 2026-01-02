import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Tab1IntakeSchema, Tab1Intake } from '../schemas/forensicSchema';

const DynamicIntakeForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Tab1Intake>({
    resolver: zodResolver(Tab1IntakeSchema),
    defaultValues: {
      audit_metadata: { posture: 'SENTINEL_ACTIVE', schema_version: 'v1.0.4' }
    }
  });

  const validateSanitization = (value: string) => {
    const piiPattern = /\b\d{16}\b|\b\d{3}\s?\d{3}\s?\d{3}\b/; // CC or TFN
    if (piiPattern.test(value)) {
      alert("Sentinel Alert: Forbidden PII Detected (CC/TFN). Please use forensic headers only.");
      return false;
    }
    return true;
  };

  const onSubmit = async (data: Tab1Intake) => {
    if (!validateSanitization(data.forensic_context.forensic_observations || "")) return;

    try {
      const forensicId = `RPR-${Date.now()}`;
      await setDoc(doc(db, 'customer_intake', forensicId), {
        ...data,
        timestamp: serverTimestamp()
      });
      alert(`Evidence Sealed: ${forensicId}`);
      reset();
    } catch (error) {
      console.error("Sentinel Block:", error);
      alert("Submission Rejected by Sentinel Rules.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-900 text-white rounded-xl">
      <header className="border-b border-cyan-900 pb-4">
        <h2 className="text-2xl font-bold tracking-widest text-cyan-400">RPR-VERIFY: FORENSIC INTAKE</h2>
        <p className="text-xs font-mono text-slate-400">STATUS: SENTINEL_ACTIVE</p>
      </header>

      {/* Identity Card */}
      <div className="p-4 border border-slate-700 rounded bg-slate-800/50">
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-4">I. Identity Verification</h3>
        <div className="grid grid-cols-2 gap-4">
          <input {...register('identity_verification.poi_document_id')} placeholder="POI Document ID" className="bg-slate-950 border border-slate-700 p-2" />
          <input {...register('identity_verification.issuing_authority_poi')} placeholder="Issuing Authority" className="bg-slate-950 border border-slate-700 p-2" />
        </div>
      </div>

      {/* Financial Nexus Card */}
      <div className="p-4 border border-slate-700 rounded bg-slate-800/50">
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-4">III. Financial Nexus</h3>
        <div className="grid grid-cols-2 gap-4">
          <input {...register('financial_nexus.bank_bsb')} placeholder="BSB (XXX-XXX)" className="bg-slate-950 border border-slate-700 p-2" />
          <input {...register('financial_nexus.bank_account_no')} placeholder="Account Number" className="bg-slate-950 border border-slate-700 p-2" />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 font-bold uppercase tracking-widest transition">
        {isSubmitting ? 'Sealing Evidence...' : 'Submit to Sentinel'}
      </button>
    </form>
  );
};

export default DynamicIntakeForm;

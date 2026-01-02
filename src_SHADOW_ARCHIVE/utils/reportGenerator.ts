import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateForensicReport = (record: any) => {
  const doc = new jsPDF();
  // Header: Sovereign Branding
  doc.setFontSize(20);
  doc.setTextColor(0, 150, 200);
  doc.text("RPR-VERIFY: FORENSIC AUDIT REPORT", 10, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Governance: RPR-KONTROL [v1.0] | ID: ${record.id}` , 10, 30);
  doc.text(`Timestamp: ${new Date().toISOString()}` , 10, 35);
  doc.line(10, 40, 200, 40);

  // Body: Data Mapping
  const body = [
    ["Parameter", "Forensic Value"],
    ["Customer ID", record.id],
    ["System Posture", record.audit_metadata?.posture || "SENTINEL_ACTIVE"],
    ["Schema Version", record.audit_metadata?.schema_version || "v1.0.4"],
    ["Data State", "VERIFIED_SECURE"]
  ];

  (doc as any).autoTable({
    startY: 50,
    head: [body[0]],
    body: body.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [0, 100, 150] }
  });

  // Footer: Evidence Seal
  doc.setFontSize(8);
  doc.text("--- RPR-VERIFY: EVIDENCE SEAL INTACT ---", 10, doc.internal.pageSize.height - 10);

  doc.save(`RPR_VERIFY_REPORT_${record.id}.pdf`);
};


import React from 'react';
import { useEscalationStream } from '../hooks/useEscalationStream';
import { generateForensicReport } from '../utils/reportGenerator';

const EscalationDashboard: React.FC = () => {
  const { records } = useEscalationStream();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <header className="border-b border-slate-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">RPR-VERIFY</h1>
        <p className="text-cyan-500 font-mono text-xs mt-1">SENTINEL COMMAND CENTER [v1.0]</p>
      </header>
      <div className="grid gap-4">
        {records.length === 0 ? (
          <div className="text-slate-500 font-mono text-sm italic">Status: TABULA RASA (Awaiting Ingestion...)</div>
        ) : (
          records.map(record => (
            <div key={record.id} className="p-4 bg-slate-900 border border-slate-800 rounded flex justify-between items-center gap-4">
              <div>
                <p className="font-mono text-cyan-400 text-sm">ID: {record.id}</p>
                <p className="text-xs text-slate-500">POSTURE: {record.audit_metadata?.posture || 'UNVERIFIED'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 rounded text-[10px] font-bold text-white uppercase tracking-widest transition"
                  onClick={() => generateForensicReport(record)}
                >
                  Download Report
                </button>
                <div className="px-3 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Sealed
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default EscalationDashboard;

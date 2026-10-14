import React, { useState } from 'react';
import { Download, Check, FileJson } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { dataService } from '../../lib/dataService';

export const DataExportButton: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [downloading, setDownloading] = useState(false);

  if (!user) return null;

  const handleDownloadDossier = async () => {
    setDownloading(true);
    try {
      const dossier = await dataService.exportDataPrincipalDossier(user.id);
      const jsonString = JSON.stringify(dossier, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `privacycart_dpdp_dossier_${user.id}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      success(
        'Data Dossier Exported',
        'Your complete Section 11 personal data package has been downloaded as JSON.'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Export Failed', msg);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadDossier}
      disabled={downloading}
      className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
      title="Download complete personal data dossier under DPDP Act 2023 Section 11"
    >
      <FileJson className="w-4 h-4 text-indigo-600" />
      <span>{downloading ? 'Compiling Dossier...' : 'Export My Data (Sec 11)'}</span>
    </button>
  );
};

import React, { useState } from 'react';
import { ShieldAlert, Database, CheckCircle, RefreshCw, X } from 'lucide-react';
import { testSupabaseConnection } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';

export const DemoModeBanner: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { info, error, success } = useNotification();

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await testSupabaseConnection();
      if (res.connected) {
        success('Supabase Online', res.message);
      } else if (res.configured) {
        error('Supabase Connection Failed', res.message);
      } else {
        info('Academic Local Demo Mode', res.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Connection Test Error', msg);
    } finally {
      setTesting(false);
    }
  };

  if (dismissed) return null;

  return (
    <aside aria-label="Academic Mode Banner" className="bg-amber-500/10 border-b border-amber-200/80 text-amber-900 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-950">SPPU Academic Demonstration Mode:</strong>{' '}
            Running with local browser persistence & simulated RLS. No claim of production database security.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="inline-flex items-center gap-1 font-medium text-amber-950 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded border border-amber-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Check live Supabase connection status"
          >
            {testing ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Database className="w-3 h-3" />
            )}
            <span>Test Supabase Link</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-700 hover:text-amber-950 p-0.5 rounded cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

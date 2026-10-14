import React from 'react';
import { useNotification, NotificationItem } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const renderIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
    }
  };

  const borderStyles = {
    success: 'border-l-4 border-l-emerald-500',
    error: 'border-l-4 border-l-rose-500',
    warning: 'border-l-4 border-l-amber-500',
    info: 'border-l-4 border-l-sky-500',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-start gap-3 transition-all transform animate-slideUp ${borderStyles[n.type]}`}
        >
          {renderIcon(n.type)}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900">{n.title}</h4>
            {n.message && <p className="text-xs text-slate-600 mt-0.5 break-words">{n.message}</p>}
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

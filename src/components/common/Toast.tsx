import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-400 shrink-0" />,
    alert: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#141824] border border-neutral-700/80 shadow-2xl text-xs font-medium text-neutral-100 max-w-sm pointer-events-auto">
        {iconMap[toast.type || 'info']}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

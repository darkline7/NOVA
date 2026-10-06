import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIFloatingTrigger: React.FC = () => {
  const { openAIAssistant, isAIAssistantOpen } = useApp();

  if (isAIAssistantOpen) return null;

  return (
    <button
      onClick={() => openAIAssistant()}
      className="fixed bottom-20 lg:bottom-8 right-5 z-40 group flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
      aria-label="Open NOVA AI Assistant"
    >
      <div className="relative">
        <Sparkles className="w-5 h-5 text-white" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-indigo-600" />
      </div>
      <span className="hidden sm:inline text-xs font-semibold tracking-wide">
        NOVA AI
      </span>
    </button>
  );
};

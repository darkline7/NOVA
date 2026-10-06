import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Users,
  Compass,
  FileText,
  ShieldCheck,
  TrendingUp,
  X,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  actionType?: 'posts' | 'people' | 'communities' | 'trending';
  timestamp: string;
}

export const AIAssistantModal: React.FC = () => {
  const {
    isAIAssistantOpen,
    closeAIAssistant,
    aiInitialContext,
    currentUser,
    posts,
    users,
    communities,
    openUserProfile,
    openCommunityDetail,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'm_init',
      sender: 'assistant',
      content: `Hello ${currentUser.displayName}! I am NOVA AI, your personalized intelligence co-pilot. I analyze signal across networks, curate discussions matching your interests (${currentUser.interests.join(
        ', '
      )}), summarize complex technical posts, and assist your writing. How can I help you today?`,
      timestamp: 'Just now',
    },
  ]);

  useEffect(() => {
    if (aiInitialContext && isAIAssistantOpen) {
      handleUserQuery(aiInitialContext);
    }
  }, [aiInitialContext, isAIAssistantOpen]);

  const handleUserQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: AIMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      content: queryText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      let actionType: AIMessage['actionType'] = undefined;
      const lower = queryText.toLowerCase();

      if (lower.includes('post') || lower.includes('recommend feed')) {
        reply = `Based on your affinities for ${currentUser.interests.join(
          ' and '
        )}, here are top recommended discussions:\n\n1. "Dynamic routing expert quantization benchmarks" by Dr. Elena Rostova in Neural Frontier.\n2. "SynthHQ crossed $42k MRR: unit economics & fast shipping" by Jordan Kim.\n3. "Volumetric fog optimization with 3D SDF depth contact shadows" by Sophia Ray.`;
        actionType = 'posts';
      } else if (lower.includes('people') || lower.includes('creator') || lower.includes('who to follow')) {
        reply = `Recommended practitioners to follow based on your tech & design focus:\n\n• Dr. Elena Rostova (@elenarostova): Senior AI Research Scientist working on sparse MoE\n• Marcus Vance (@marcus_vance): Quantitative systems engineer & crypto orderbook modeling\n• Sophia Ray (@sophiaray): Creative shaders specialist & indie game developer`;
        actionType = 'people';
      } else if (lower.includes('communit') || lower.includes('group')) {
        reply = `Top matching communities for your profile:\n\n• Neural Frontier: 18,450 members exploring foundational models & agentic frameworks\n• Clean Architecture Guild: 14,200 systems engineers discussing domain-driven design\n• Quantitative Alpha: 9,350 practitioners discussing algorithmic volatility & execution`;
        actionType = 'communities';
      } else if (lower.includes('trending') || lower.includes('explain')) {
        reply = `Trending Analysis:\n\n#SparseMoE (+182% this week): The community is standardizing on dynamically routed mixture-of-experts for lower active inference params.\n#SpatialDesign (+94%): Product designers are ditching generic neon/card slop for refined dark obsidian typography.`;
        actionType = 'trending';
      } else if (lower.includes('spam') || lower.includes('safe') || lower.includes('toxic')) {
        reply = `NOVA Heuristic Moderation Scan:\n\n• Analyzed the latest 50 feed items: 98.4% high-signal ratio\n• Flagged 1 automated crypto arbitrage bot and 1 impersonator (queued in Admin Console)\n• Zero hate speech or abusive toxicity detected. Network health is optimal.`;
      } else {
        reply = `I evaluated your request against NOVA's knowledge graph. For your interests in ${currentUser.interests.join(
          ', '
        )}, I suggest connecting with specialists in the Neural Frontier community or publishing an update on your recent project work.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          content: reply,
          actionType,
          timestamp: 'Just now',
        },
      ]);
      setLoading(false);
    }, 800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserQuery(input);
  };

  return (
    <Modal
      isOpen={isAIAssistantOpen}
      onClose={closeAIAssistant}
      title="NOVA Intelligence Co-Pilot"
      description="Discovery, summarization, writing tools, and community recommendations"
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleUserQuery('Recommend top technical posts')}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 hover:bg-indigo-900/40 whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Recommend Posts</span>
          </button>
          <button
            onClick={() => handleUserQuery('Recommend creators to follow')}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 hover:bg-indigo-900/40 whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <Users className="w-3 h-3 text-indigo-400" />
            <span>Find Creators</span>
          </button>
          <button
            onClick={() => handleUserQuery('Explain trending topics today')}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 hover:bg-indigo-900/40 whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <TrendingUp className="w-3 h-3 text-indigo-400" />
            <span>Explain Trends</span>
          </button>
          <button
            onClick={() => handleUserQuery('Scan network for spam and toxicity')}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 hover:bg-indigo-900/40 whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span>Safety Audit</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="h-72 overflow-y-auto space-y-3 p-3 rounded-xl bg-[#0e121a] border border-neutral-800/80 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[90%] leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-[#151a26] text-neutral-200 border border-neutral-800/80 rounded-bl-xs'
                }`}
              >
                {m.sender === 'assistant' && (
                  <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>NOVA AI</span>
                  </div>
                )}
                <p>{m.content}</p>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono mt-0.5 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#151a26] border border-neutral-800 text-xs text-neutral-400 max-w-[70%]">
              <div className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
              <span>Analyzing NOVA knowledge graph...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask NOVA AI anything..."
            className="flex-1 bg-[#121620] border border-neutral-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Modal>
  );
};

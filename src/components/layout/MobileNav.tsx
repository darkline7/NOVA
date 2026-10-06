import React from 'react';
import { Home, Compass, Plus, Users, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileNavProps {
  onOpenCreatePost: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenCreatePost }) => {
  const { activeTab, setActiveTab, conversations } = useApp();

  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0e14]/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-1 safe-area-bottom select-none"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto">
        {/* Home */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-indigo-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Home Feed"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Home</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'explore' ? 'text-indigo-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Explore"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Explore</span>
        </button>

        {/* Center: Create Post CTA */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenCreatePost}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform cursor-pointer"
            aria-label="Create Post"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Communities */}
        <button
          onClick={() => setActiveTab('communities')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'communities' || activeTab === 'community_detail'
              ? 'text-indigo-400'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Communities"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Groups</span>
        </button>

        {/* Messages */}
        <button
          onClick={() => setActiveTab('messages')}
          className={`min-h-[44px] min-w-[44px] relative flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'messages' ? 'text-indigo-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Messages"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Chat</span>
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </button>
      </div>
    </nav>
  );
};

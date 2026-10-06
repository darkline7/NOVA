import React from 'react';
import { Sparkles, Search, Bell, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';

interface NavbarProps {
  onOpenCreatePost: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreatePost }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    openAIAssistant,
    notifications,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const tabTitles: Record<string, string> = {
    feed: 'Home Feed',
    explore: 'Explore & Discover',
    communities: 'Communities',
    community_detail: 'Community',
    messages: 'Messages',
    notifications: 'Notifications',
    bookmarks: 'Bookmarks',
    profile: 'Your Profile',
    user_profile: 'Profile',
    admin: 'Admin Console',
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800/80 bg-[#0b0e14]/90 backdrop-blur-md">
      {/* Zone 1: Brand title or contextual section title */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => setActiveTab('feed')}
          className="lg:hidden flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-display font-bold text-white text-sm">
            N
          </div>
          <span className="font-display font-bold text-base tracking-tight text-white">
            NOVA
          </span>
        </div>

        <h1 className="hidden lg:block text-base font-semibold text-white tracking-tight">
          {tabTitles[activeTab] || 'NOVA'}
        </h1>
      </div>

      {/* Zone 2: Search input on tablet / smaller desktop */}
      <div className="hidden md:flex xl:hidden items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setActiveTab('explore');
            }}
            placeholder="Search NOVA..."
            className="w-full bg-[#12161f] border border-neutral-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Zone 3: Primary quick actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* NOVA AI Shortcut Button */}
        <button
          onClick={() => openAIAssistant()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/40 text-xs font-medium transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">NOVA AI</span>
        </button>

        {/* Notifications shortcut (visible on tablet/mobile) */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="lg:hidden relative p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifs > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </button>

        {/* Admin shortcut badge if admin */}
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-neutral-400 hover:text-amber-300 hover:bg-neutral-800/40'
            }`}
            title="Admin Console"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        )}

        {/* Profile Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="cursor-pointer transition-transform active:scale-95"
          aria-label="User Profile"
        >
          <Avatar
            src={currentUser.avatar}
            name={currentUser.displayName}
            size="sm"
            onlineStatus="online"
          />
        </button>
      </div>
    </header>
  );
};

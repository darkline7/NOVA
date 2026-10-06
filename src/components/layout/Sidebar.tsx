import React from 'react';
import {
  Home,
  Compass,
  Users,
  MessageSquare,
  Bell,
  Bookmark,
  User,
  ShieldAlert,
  Sparkles,
  PenSquare,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { ActiveTab } from '../../types';

interface SidebarProps {
  onOpenCreatePost: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreatePost }) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    notifications,
    conversations,
    setIsAuthenticated,
    openAIAssistant,
  } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    { id: 'feed', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'communities', label: 'Communities', icon: <Users className="w-5 h-5" /> },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: unreadMessages,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotifs,
    },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldAlert className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-screen sticky top-0 px-4 py-6 border-r border-neutral-800/80 bg-[#0b0e14] z-20 select-none">
      {/* Brand Zone */}
      <div className="flex items-center justify-between px-3 mb-6">
        <button
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-base tracking-wider font-display">N</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            NOVA
          </span>
        </button>

        <button
          onClick={() => openAIAssistant()}
          className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors cursor-pointer"
          title="Open NOVA AI"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            activeTab === item.id ||
            (item.id === 'communities' && activeTab === 'community_detail') ||
            (item.id === 'profile' && activeTab === 'user_profile');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-800/80 text-white shadow-sm shadow-black/20'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-indigo-400' : 'text-neutral-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {Boolean(item.badge && item.badge > 0) && (
                <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-full bg-indigo-600 text-white font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Primary Action Button */}
      <div className="pt-4 mb-5">
        <button
          onClick={onOpenCreatePost}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 active:scale-[0.98] transition-all cursor-pointer"
        >
          <PenSquare className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* User Session Footer Card */}
      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 text-left overflow-hidden group cursor-pointer"
        >
          <Avatar
            src={currentUser.avatar}
            name={currentUser.displayName}
            size="sm"
            onlineStatus="online"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-200 truncate group-hover:text-indigo-300 transition-colors">
              {currentUser.displayName}
            </p>
            <p className="text-[11px] text-neutral-500 truncate">
              @{currentUser.username}
            </p>
          </div>
        </button>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800/50 transition-colors cursor-pointer"
          title="Sign out / Landing page"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

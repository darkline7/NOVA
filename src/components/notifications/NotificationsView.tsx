import React, { useState } from 'react';
import {
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  Repeat2,
  Users,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { NotificationType } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openUserProfile,
    openCommunityDetail,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />;
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      case 'repost':
        return <Repeat2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'community':
        return <Users className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Notifications
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time interactions from your network and communities.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
          onClick={markAllNotificationsRead}
        >
          Mark all read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#121620] border border-neutral-800 rounded-xl overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'like', label: 'Likes' },
          { id: 'comment', label: 'Comments' },
          { id: 'follow', label: 'Follows' },
          { id: 'community', label: 'Communities' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`flex-1 min-w-[70px] py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              filterType === tab.id
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                item.isRead
                  ? 'bg-[#11151f]/50 border-neutral-800/60'
                  : 'bg-[#141926] border-indigo-900/50 shadow-sm'
              }`}
            >
              {/* Indicator icon */}
              <div className="w-7 h-7 rounded-lg bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center shrink-0 mt-0.5">
                {getNotificationIcon(item.type)}
              </div>

              {/* Actor avatar */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  openUserProfile(item.actor.id);
                }}
                className="cursor-pointer"
              >
                <Avatar
                  src={item.actor.avatar}
                  name={item.actor.displayName}
                  size="sm"
                />
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-neutral-200">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                    {item.createdAt}
                  </span>
                </div>

                {item.description && (
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Unread dot */}
              {!item.isRead && (
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50">
            <Bell className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-xs text-neutral-400">
              No notifications to display in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Search, Sparkles, TrendingUp, Users, Check, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { TRENDING_TOPICS } from '../../data/mockData';

export const RightSidebar: React.FC = () => {
  const {
    users,
    currentUser,
    communities,
    toggleFollowUser,
    joinCommunity,
    leaveCommunity,
    openUserProfile,
    openCommunityDetail,
    openConversation,
    openAIAssistant,
    searchQuery,
    setSearchQuery,
    setActiveTab,
  } = useApp();

  // Suggested users (exclude current user)
  const suggestedUsers = users
    .filter((u) => u.id !== currentUser.id)
    .slice(0, 3);

  // Suggested communities
  const suggestedCommunities = communities.slice(0, 3);

  // Online contacts
  const onlineContacts = users.filter(
    (u) => u.id !== currentUser.id && u.onlineStatus === 'online'
  );

  return (
    <aside className="hidden xl:block w-80 shrink-0 h-screen sticky top-0 px-4 py-6 border-l border-neutral-800/80 bg-[#0b0e14] overflow-y-auto space-y-6 select-none">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setActiveTab('explore');
            }
          }}
          placeholder="Search NOVA (topics, people, tags)..."
          className="w-full bg-[#12161f] border border-neutral-800 focus:border-indigo-500/80 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      {/* Trending Topics */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#11151f]/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-neutral-200">
              Trending on NOVA
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-[11px] text-neutral-400 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Explore all
          </button>
        </div>

        <div className="space-y-3">
          {TRENDING_TOPICS.slice(0, 4).map((topic, i) => (
            <div
              key={i}
              className="group flex items-start justify-between text-left hover:bg-neutral-800/30 p-1.5 -mx-1.5 rounded-lg transition-colors"
            >
              <div
                className="cursor-pointer"
                onClick={() => {
                  setSearchQuery(topic.tag);
                  setActiveTab('explore');
                }}
              >
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <span>{topic.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-neutral-400">
                    {topic.count}
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-200 group-hover:text-indigo-300 transition-colors mt-0.5">
                  {topic.tag}
                </p>
                <span className="text-[10px] text-emerald-400/80 font-mono">
                  {topic.trend}
                </span>
              </div>

              <button
                onClick={() =>
                  openAIAssistant(
                    `Explain why ${topic.tag} in ${topic.category} is trending on NOVA right now: ${topic.explanation}`
                  )
                }
                title="Explain with NOVA AI"
                className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-indigo-400 hover:bg-neutral-700/40 rounded transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested People */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#11151f]/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-neutral-200">
            Creators to Follow
          </h3>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-[11px] text-neutral-400 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            See more
          </button>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-2">
              <div
                onClick={() => openUserProfile(user.id)}
                className="flex items-center gap-2.5 overflow-hidden cursor-pointer group flex-1"
              >
                <Avatar
                  src={user.avatar}
                  name={user.displayName}
                  size="sm"
                  onlineStatus={user.onlineStatus}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-200 truncate group-hover:text-indigo-300 transition-colors">
                    {user.displayName}
                  </p>
                  <p className="text-[11px] text-neutral-500 truncate">
                    @{user.username}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollowUser(user.id)}
                className={`py-1 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  user.isFollowing
                    ? 'bg-neutral-800/80 text-neutral-300 border border-neutral-700/60 hover:border-rose-500/40 hover:text-rose-400'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Communities */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#11151f]/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-neutral-400" />
            <h3 className="text-xs font-semibold text-neutral-200">
              Active Communities
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('communities')}
            className="text-[11px] text-neutral-400 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="space-y-3">
          {suggestedCommunities.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-2">
              <div
                onClick={() => openCommunityDetail(c.id)}
                className="flex items-center gap-2.5 overflow-hidden cursor-pointer group flex-1"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/30 flex items-center justify-center shrink-0 text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-neutral-200 truncate group-hover:text-indigo-300 transition-colors">
                    {c.name}
                  </p>
                  <p className="text-[11px] text-neutral-500 truncate font-mono tabular-nums">
                    {c.memberCount.toLocaleString()} members
                  </p>
                </div>
              </div>

              <button
                onClick={() => (c.isJoined ? leaveCommunity(c.id) : joinCommunity(c.id))}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  c.isJoined
                    ? 'bg-neutral-800 text-neutral-400 hover:text-rose-400'
                    : 'bg-neutral-800 hover:bg-indigo-600 text-neutral-200 hover:text-white'
                }`}
                title={c.isJoined ? 'Leave community' : 'Join community'}
              >
                {c.isJoined ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Online Contacts */}
      {onlineContacts.length > 0 && (
        <div className="rounded-2xl border border-neutral-800/80 bg-[#11151f]/60 p-4">
          <h3 className="text-xs font-semibold text-neutral-200 mb-3">
            Active Now ({onlineContacts.length})
          </h3>
          <div className="space-y-2">
            {onlineContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  openConversation('conv_1');
                }}
                className="flex items-center gap-2.5 p-1 -mx-1 rounded-lg hover:bg-neutral-800/40 cursor-pointer transition-colors"
              >
                <Avatar
                  src={contact.avatar}
                  name={contact.displayName}
                  size="xs"
                  onlineStatus="online"
                />
                <span className="text-xs text-neutral-300 truncate">
                  {contact.displayName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer quiet copyright & links */}
      <div className="px-1 text-[11px] text-neutral-500 space-y-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#about" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }} className="hover:text-neutral-300">About</a>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }} className="hover:text-neutral-300">Privacy</a>
          <a href="#rules" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }} className="hover:text-neutral-300">Community Rules</a>
          <a href="#ai" onClick={(e) => { e.preventDefault(); openAIAssistant(); }} className="hover:text-neutral-300">NOVA AI</a>
        </div>
        <p className="pt-2 text-neutral-600">NOVA © 2026 · Next-Generation Identity & Network</p>
      </div>
    </aside>
  );
};

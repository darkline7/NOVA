import React, { useState } from 'react';
import {
  Users,
  Shield,
  BookOpen,
  Info,
  Plus,
  Check,
  Sparkles,
  ArrowLeft,
  Crown,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { PostCard } from '../feed/PostCard';
import { PostComposer } from '../feed/PostComposer';
import { CreateCommunityModal } from './CreateCommunityModal';
import { Community, CommunityRole } from '../../types';

export const CommunityView: React.FC = () => {
  const {
    communities,
    selectedCommunityId,
    openCommunityDetail,
    setActiveTab,
    posts,
    users,
    joinCommunity,
    leaveCommunity,
    openUserProfile,
    openAIAssistant,
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'posts' | 'members' | 'rules' | 'about'>('posts');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Active community if in detail mode
  const currentCommunity = communities.find((c) => c.id === selectedCommunityId);

  // If no community is selected or just browsing communities:
  if (!currentCommunity) {
    const categories = ['All', 'AI', 'Technology', 'Finance', 'Gaming', 'Programming', 'Business'];

    const filteredCommunities = communities.filter((c) => {
      if (categoryFilter === 'All') return true;
      return c.category === categoryFilter;
    });

    return (
      <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-6">
        {/* Header & Create CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Communities
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Join focused circles of practitioners, researchers, and creators.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Community
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#121620] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of communities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommunities.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl overflow-hidden bg-[#11151f] border border-neutral-800/80 flex flex-col justify-between"
            >
              <div
                className="h-28 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${c.coverImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#11151f] via-[#11151f]/40 to-transparent" />
              </div>

              <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-end justify-between -mt-6 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shadow-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <button
                      onClick={() =>
                        c.isJoined ? leaveCommunity(c.id) : joinCommunity(c.id)
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
                        c.isJoined
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {c.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>

                  <h3
                    onClick={() => openCommunityDetail(c.id)}
                    className="text-base font-semibold text-white hover:text-indigo-300 cursor-pointer"
                  >
                    {c.name}
                  </h3>
                  <p className="text-xs text-indigo-400 mt-0.5">{c.tagline}</p>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 font-mono">
                  <span>{c.memberCount.toLocaleString()} members</span>
                  <button
                    onClick={() => openCommunityDetail(c.id)}
                    className="text-indigo-400 hover:underline cursor-pointer"
                  >
                    Enter Room →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CreateCommunityModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    );
  }

  // Community Detail View
  const communityPosts = posts.filter((p) => p.communityId === currentCommunity.id);

  // Sample members with explicit roles
  const membersWithRoles: {
    user: (typeof users)[0];
    role: CommunityRole;
  }[] = [
    { user: users[0], role: 'owner' },
    { user: users[1], role: 'admin' },
    { user: users[2], role: 'moderator' },
    { user: users[3], role: 'member' },
    { user: users[4], role: 'member' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => setActiveTab('communities')}
        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all communities</span>
      </button>

      {/* Community Hero Header */}
      <div className="rounded-2xl overflow-hidden bg-[#11151f] border border-neutral-800/80 shadow-md">
        <div
          className="h-44 sm:h-52 w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${currentCommunity.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#11151f] via-black/30 to-transparent" />
        </div>

        <div className="p-4 sm:p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10 sm:-mt-12 mb-4 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-950 border-2 border-indigo-700/60 flex items-center justify-center text-indigo-400 shadow-2xl">
              <Users className="w-10 h-10" />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={currentCommunity.isJoined ? 'secondary' : 'primary'}
                size="sm"
                onClick={() =>
                  currentCommunity.isJoined
                    ? leaveCommunity(currentCommunity.id)
                    : joinCommunity(currentCommunity.id)
                }
              >
                {currentCommunity.isJoined ? 'Joined Community' : 'Join Community'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  openAIAssistant(
                    `Give me a summary of key discussion topics and recommended reading for the ${currentCommunity.name} community on NOVA.`
                  )
                }
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentCommunity.name}
              </h2>
              <span className="text-xs text-indigo-400 border border-indigo-900/60 rounded px-2 py-0.5 font-medium">
                {currentCommunity.category}
              </span>
            </div>
            <p className="text-xs text-indigo-300 mt-1 font-medium">
              {currentCommunity.tagline}
            </p>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed max-w-2xl">
              {currentCommunity.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-400 mt-4 pt-3 border-t border-neutral-800/60 font-mono">
            <span>{currentCommunity.memberCount.toLocaleString()} members</span>
            <span>·</span>
            <span>Created {currentCommunity.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#121620] border border-neutral-800/80 rounded-xl">
        <button
          onClick={() => setActiveTabSub('posts')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTabSub === 'posts' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span>Discussions</span>
          <span className="text-[10px] text-neutral-500 font-mono">
            ({communityPosts.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTabSub('members')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTabSub === 'members' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Members & Roles</span>
        </button>

        <button
          onClick={() => setActiveTabSub('rules')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTabSub === 'rules' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Rules</span>
        </button>

        <button
          onClick={() => setActiveTabSub('about')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTabSub === 'about' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>About</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTabSub === 'posts' && (
        <div className="space-y-4">
          <PostComposer
            defaultCommunityId={currentCommunity.id}
            defaultCommunityName={currentCommunity.name}
          />
          {communityPosts.length > 0 ? (
            communityPosts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div className="p-8 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50">
              <p className="text-xs text-neutral-400">
                No posts inside this community yet. Be the first to start the discussion!
              </p>
            </div>
          )}
        </div>
      )}

      {activeTabSub === 'members' && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Leadership & Community Members
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {membersWithRoles.map(({ user, role }) => {
              const roleBadge = {
                owner: { label: 'Owner', icon: <Crown className="w-3 h-3 text-amber-400" /> },
                admin: { label: 'Admin', icon: <Shield className="w-3 h-3 text-indigo-400" /> },
                moderator: { label: 'Moderator', icon: <UserCheck className="w-3 h-3 text-cyan-400" /> },
                member: { label: 'Member', icon: null },
              }[role];

              return (
                <div
                  key={user.id}
                  className="p-3.5 rounded-xl bg-[#11151f] border border-neutral-800 flex items-center justify-between gap-3"
                >
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
                      <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-300">
                        {user.displayName}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-800/60 px-2 py-0.5 rounded-md border border-neutral-700/40">
                    {roleBadge.icon}
                    <span>{roleBadge.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTabSub === 'rules' && (
        <div className="rounded-2xl border border-neutral-800 bg-[#11151f] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">
            Community Guidelines & Enforcement Standards
          </h3>
          <div className="space-y-3">
            {currentCommunity.rules.map((rule, idx) => (
              <div
                key={rule.id}
                className="p-3 rounded-xl bg-[#141924] border border-neutral-800"
              >
                <h4 className="text-xs font-semibold text-neutral-200">
                  {idx + 1}. {rule.title}
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTabSub === 'about' && (
        <div className="rounded-2xl border border-neutral-800 bg-[#11151f] p-5 space-y-4 text-xs text-neutral-300 leading-relaxed">
          <h3 className="text-sm font-semibold text-white">
            About {currentCommunity.name}
          </h3>
          <p>{currentCommunity.description}</p>
          <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-4 font-mono text-neutral-400">
            <div>
              <span className="text-neutral-500 block">Category</span>
              <span className="text-neutral-200">{currentCommunity.category}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Total Membership</span>
              <span className="text-neutral-200">{currentCommunity.memberCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Privacy</span>
              <span className="text-neutral-200">Public Open Room</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Founded</span>
              <span className="text-neutral-200">{currentCommunity.createdAt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

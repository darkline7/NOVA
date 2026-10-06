import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Sparkles,
  Users,
  Compass,
  Tag,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { PostCard } from '../feed/PostCard';
import { TRENDING_TOPICS } from '../../data/mockData';
import { InterestTag } from '../../types';

type ExploreSection = 'trending' | 'for_you' | 'communities' | 'creators' | 'topics';

export const ExploreView: React.FC = () => {
  const {
    users,
    currentUser,
    communities,
    posts,
    searchQuery,
    setSearchQuery,
    toggleFollowUser,
    joinCommunity,
    leaveCommunity,
    openUserProfile,
    openCommunityDetail,
    openAIAssistant,
  } = useApp();

  const [activeSection, setActiveSection] = useState<ExploreSection>('trending');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const topicsList = ['All', 'AI', 'Technology', 'Finance', 'Crypto', 'Gaming', 'Design', 'Programming'];

  // Search filtered results
  const q = searchQuery.toLowerCase().trim();

  const matchedUsers = users.filter(
    (u) =>
      u.id !== currentUser.id &&
      (u.displayName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q))
  );

  const matchedCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );

  const matchedPosts = posts.filter(
    (p) =>
      p.content.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
  );

  const isSearching = q.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-6">
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by keywords, people, topics, or communities..."
          className="w-full bg-[#121620] border border-neutral-800 focus:border-indigo-500/80 rounded-2xl py-3 pl-11 pr-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Topics pill scroller (interactive filter buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {topicsList.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedTopic === topic
                ? 'bg-indigo-600 text-white'
                : 'bg-[#121620] text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* If actively searching, show unified search result columns */}
      {isSearching ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
            <span>
              Search results for &ldquo;{searchQuery}&rdquo;
            </span>
            <span className="font-mono tabular-nums">
              {matchedUsers.length + matchedCommunities.length + matchedPosts.length} results
            </span>
          </div>

          {/* Matched Creators */}
          {matchedUsers.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                People ({matchedUsers.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedUsers.map((user) => (
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
                        size="md"
                        onlineStatus={user.onlineStatus}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-neutral-100 truncate group-hover:text-indigo-300">
                          {user.displayName}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          @{user.username}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {user.bio}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFollowUser(user.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        user.isFollowing
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Communities */}
          {matchedCommunities.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                Communities ({matchedCommunities.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedCommunities.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-[#11151f] border border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <div
                      onClick={() => openCommunityDetail(c.id)}
                      className="cursor-pointer flex-1 min-w-0"
                    >
                      <h4 className="text-xs font-semibold text-neutral-100 hover:text-indigo-300 truncate">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {c.tagline}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-1">
                        <span>{c.category}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">
                          {c.memberCount.toLocaleString()} members
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        c.isJoined ? leaveCommunity(c.id) : joinCommunity(c.id)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        c.isJoined
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      {c.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Posts */}
          {matchedPosts.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                Posts ({matchedPosts.length})
              </h3>
              <div className="space-y-4">
                {matchedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {matchedUsers.length === 0 &&
            matchedCommunities.length === 0 &&
            matchedPosts.length === 0 && (
              <div className="p-10 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50">
                <Search className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-300">
                  No matches for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Try searching for AI, design, quant, or specific usernames.
                </p>
              </div>
            )}
        </div>
      ) : (
        /* Normal Exploration Mode */
        <div className="space-y-6">
          {/* Section Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#121620] border border-neutral-800/80 rounded-xl">
            <button
              onClick={() => setActiveSection('trending')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSection === 'trending'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Trending</span>
            </button>
            <button
              onClick={() => setActiveSection('creators')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSection === 'creators'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Creators</span>
            </button>
            <button
              onClick={() => setActiveSection('communities')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSection === 'communities'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Communities</span>
            </button>
            <button
              onClick={() => setActiveSection('topics')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSection === 'topics'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Topics</span>
            </button>
          </div>

          {/* Section Content: Trending */}
          {activeSection === 'trending' && (
            <div className="space-y-6">
              {/* Trending Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {TRENDING_TOPICS.map((topic, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#11151f] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                        <div className="flex items-center gap-2">
                          <span>{topic.category}</span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">
                            {topic.count}
                          </span>
                        </div>
                        <span className="text-emerald-400/90 font-mono text-[11px]">
                          {topic.trend}
                        </span>
                      </div>
                      <h4
                        onClick={() => {
                          setSearchQuery(topic.tag);
                        }}
                        className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        {topic.tag}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {topic.explanation}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-neutral-800/60 flex items-center justify-between">
                      <button
                        onClick={() =>
                          openAIAssistant(
                            `Give me an in-depth breakdown of what's driving ${topic.tag} across tech and finance communities today.`
                          )
                        }
                        className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Explain with AI</span>
                      </button>

                      <button
                        onClick={() => setSearchQuery(topic.tag)}
                        className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View posts</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Latest Trending Posts Stream */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-200 mb-3">
                  Trending Conversations
                </h3>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section Content: Creators */}
          {activeSection === 'creators' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users
                .filter((u) => u.id !== currentUser.id)
                .map((user) => (
                  <div
                    key={user.id}
                    className="p-5 rounded-2xl bg-[#11151f] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          onClick={() => openUserProfile(user.id)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <Avatar
                            src={user.avatar}
                            name={user.displayName}
                            size="lg"
                            onlineStatus={user.onlineStatus}
                          />
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                              {user.displayName}
                            </p>
                            <p className="text-xs text-neutral-500">
                              @{user.username}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleFollowUser(user.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            user.isFollowing
                              ? 'bg-neutral-800 text-neutral-300 hover:text-rose-400'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {user.isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                        {user.bio}
                      </p>

                      {/* User Interests (zero pill discipline: unboxed text) */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
                        {user.interests.map((tag, idx) => (
                          <React.Fragment key={tag}>
                            <span>{tag}</span>
                            {idx < user.interests.length - 1 && (
                              <span aria-hidden="true">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 mt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 font-mono tabular-nums">
                      <span>{user.followersCount.toLocaleString()} followers</span>
                      <button
                        onClick={() => openUserProfile(user.id)}
                        className="text-indigo-400 hover:underline cursor-pointer"
                      >
                        View Profile →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Section Content: Communities */}
          {activeSection === 'communities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communities.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl overflow-hidden bg-[#11151f] border border-neutral-800/80 flex flex-col justify-between"
                >
                  <div
                    className="h-24 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${c.coverImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11151f] via-[#11151f]/50 to-transparent" />
                  </div>

                  <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-end justify-between -mt-5 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shadow-lg">
                          <Users className="w-5 h-5" />
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
                          {c.isJoined ? 'Joined' : 'Join Community'}
                        </button>
                      </div>

                      <h4
                        onClick={() => openCommunityDetail(c.id)}
                        className="text-base font-semibold text-white hover:text-indigo-300 cursor-pointer"
                      >
                        {c.name}
                      </h4>
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
          )}

          {/* Section Content: Topics */}
          {activeSection === 'topics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TRENDING_TOPICS.map((topic, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#11151f] border border-neutral-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {topic.category}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-1">
                      {topic.tag}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      {topic.explanation}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-500">{topic.count}</span>
                    <button
                      onClick={() => {
                        setSearchQuery(topic.tag);
                        setActiveSection('trending');
                      }}
                      className="text-indigo-400 hover:underline cursor-pointer"
                    >
                      Search Tag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

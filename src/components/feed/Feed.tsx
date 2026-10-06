import React, { useState } from 'react';
import { Sparkles, Users, Compass, SlidersHorizontal, MessageSquarePlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PostCard } from './PostCard';
import { PostComposer } from './PostComposer';

type FeedTab = 'for_you' | 'following' | 'interests';

export const Feed: React.FC = () => {
  const { posts, currentUser, searchQuery, setSearchQuery } = useApp();
  const [feedTab, setFeedTab] = useState<FeedTab>('for_you');

  // Filter posts based on active feed tab and search query
  const filteredPosts = posts.filter((post) => {
    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor =
        post.author.displayName.toLowerCase().includes(q) ||
        post.author.username.toLowerCase().includes(q);
      const matchTags = post.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchContent && !matchAuthor && !matchTags) return false;
    }

    if (feedTab === 'following') {
      return post.author.isFollowing || post.author.id === currentUser.id;
    }

    if (feedTab === 'interests') {
      const userInterests = currentUser.interests || [];
      const postTags = post.tags || [];
      const hasOverlap = postTags.some((tag) =>
        userInterests.some((ui) => ui.toLowerCase() === tag.toLowerCase())
      );
      return hasOverlap || post.author.id === currentUser.id;
    }

    // Default 'for_you': show all posts
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-4">
      {/* Segmented Feed Controls */}
      <div className="flex items-center justify-between p-1 bg-[#121620] border border-neutral-800/80 rounded-xl">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setFeedTab('for_you')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              feedTab === 'for_you'
                ? 'bg-neutral-800 text-white shadow-sm shadow-black/20'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>For You</span>
          </button>

          <button
            onClick={() => setFeedTab('following')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              feedTab === 'following'
                ? 'bg-neutral-800 text-white shadow-sm shadow-black/20'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Following</span>
          </button>

          <button
            onClick={() => setFeedTab('interests')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              feedTab === 'interests'
                ? 'bg-neutral-800 text-white shadow-sm shadow-black/20'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Your Interests</span>
          </button>
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="hidden sm:inline-flex text-[11px] text-neutral-400 hover:text-white px-2 py-1"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Active search banner if filtering */}
      {searchQuery && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-300">
          <span>Filtering posts matching &ldquo;{searchQuery}&rdquo;</span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-neutral-400 hover:text-white underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {/* Post Composer Inline */}
      <PostComposer />

      {/* Posts Stream */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50 space-y-3">
          <MessageSquarePlus className="w-8 h-8 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-200">
            No posts found in this feed view
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchQuery
              ? `No posts matched your search "${searchQuery}". Try different keywords or reset filter.`
              : feedTab === 'following'
              ? 'You are not following anyone yet or your network has not posted today. Follow creators in Explore!'
              : 'Add more interest tags in your profile to discover customized topics.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 text-xs text-neutral-200 hover:text-white"
            >
              Reset Search Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

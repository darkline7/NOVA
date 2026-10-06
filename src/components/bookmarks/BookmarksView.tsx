import React, { useState } from 'react';
import { Bookmark, FileText, Video, Image, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PostCard } from '../feed/PostCard';

type BookmarkCategory = 'all' | 'articles' | 'videos' | 'images' | 'posts';

export const BookmarksView: React.FC = () => {
  const { posts } = useApp();
  const [activeCategory, setActiveCategory] = useState<BookmarkCategory>('all');

  const bookmarkedPosts = posts.filter((p) => p.isBookmarked);

  const filteredPosts = bookmarkedPosts.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'articles') return Boolean(p.linkPreview);
    if (activeCategory === 'videos') return p.type === 'video';
    if (activeCategory === 'images')
      return p.type === 'image' || p.type === 'multi_image';
    if (activeCategory === 'posts') return p.type === 'text' || p.type === 'poll';
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Saved Bookmarks
          </h2>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Your curated personal library of discussions, links, media, and tools.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#121620] border border-neutral-800 rounded-xl overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'All', icon: <Bookmark className="w-3.5 h-3.5" /> },
          { id: 'articles', label: 'Articles & Links', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'videos', label: 'Videos', icon: <Video className="w-3.5 h-3.5" /> },
          { id: 'images', label: 'Images', icon: <Image className="w-3.5 h-3.5" /> },
          { id: 'posts', label: 'Posts & Polls', icon: <MessageSquare className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as BookmarkCategory)}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="p-10 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50">
            <Bookmark className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-300">
              No bookmarks in &ldquo;{activeCategory}&rdquo;
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Tap the bookmark icon on any post in the feed or explore page to save it for later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

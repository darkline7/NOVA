import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Repeat2,
  Bookmark,
  Share2,
  MoreHorizontal,
  Sparkles,
  ExternalLink,
  Play,
  Check,
  Copy,
  Flag,
  EyeOff,
} from 'lucide-react';
import { Post } from '../../types';
import { Avatar } from '../common/Avatar';
import { PollCard } from './PollCard';
import { CommentSection } from './CommentSection';
import { Dropdown } from '../common/Dropdown';
import { useApp } from '../../context/AppContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    currentUser,
    toggleLikePost,
    toggleRepost,
    toggleBookmark,
    votePoll,
    addComment,
    openUserProfile,
    openCommunityDetail,
    openAIAssistant,
    deletePost,
    showToast,
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Post link copied to clipboard', 'success');
  };

  const handleCopyText = () => {
    navigator.clipboard?.writeText(post.content);
    showToast('Text copied to clipboard', 'info');
  };

  const moreMenuItems = [
    {
      label: 'Copy text',
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: handleCopyText,
    },
    {
      label: 'Summarize with NOVA AI',
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />,
      onClick: () => {
        setShowAISummary(true);
        showToast('Generated AI summary', 'info');
      },
    },
    {
      label: 'Hide this post',
      icon: <EyeOff className="w-3.5 h-3.5" />,
      onClick: () => {
        deletePost(post.id);
      },
    },
    {
      label: 'Report content',
      icon: <Flag className="w-3.5 h-3.5" />,
      danger: true,
      onClick: () => {
        showToast('Report submitted for review', 'info');
      },
    },
  ];

  return (
    <article className="p-4 sm:p-5 rounded-2xl bg-[#11151f]/80 border border-neutral-800/80 hover:border-neutral-750 transition-colors">
      {/* Header: Author + Metadata (Strict Zero-Pill) */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            onClick={() => openUserProfile(post.author.id)}
            className="cursor-pointer"
          >
            <Avatar
              src={post.author.avatar}
              name={post.author.displayName}
              size="md"
              onlineStatus={post.author.onlineStatus}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => openUserProfile(post.author.id)}
                className="font-semibold text-sm text-neutral-100 hover:text-indigo-300 transition-colors cursor-pointer text-left"
              >
                {post.author.displayName}
              </button>

              {post.author.isVerified && (
                <span
                  title="Verified Contributor"
                  className="w-3.5 h-3.5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-bold"
                >
                  ✓
                </span>
              )}

              {/* Zero-pill metadata inline */}
              <span className="text-xs text-neutral-500">
                @{post.author.username}
              </span>
              <span className="text-xs text-neutral-600" aria-hidden="true">
                ·
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                {post.createdAt}
              </span>
            </div>

            {post.communityName && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                <span>in</span>
                <button
                  onClick={() =>
                    post.communityId && openCommunityDetail(post.communityId)
                  }
                  className="text-indigo-400 hover:underline cursor-pointer font-medium"
                >
                  {post.communityName}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* More Options */}
        <Dropdown
          trigger={
            <button
              className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50 transition-colors cursor-pointer"
              aria-label="Post actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
          items={moreMenuItems}
        />
      </div>

      {/* Main Post Content */}
      <div className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line mb-3">
        {post.content}
      </div>

      {/* Tags (Zero-pill clean inline metadata) */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-3 text-xs text-indigo-400/90 font-medium flex-wrap">
          {post.tags.map((tag, idx) => (
            <span key={idx}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Media: Images */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="my-3 rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-900">
          {post.mediaUrls.length === 1 ? (
            <img
              src={post.mediaUrls[0]}
              alt="Post attachment"
              referrerPolicy="no-referrer"
              className="w-full max-h-96 object-cover"
            />
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {post.mediaUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Attachment ${i + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Media: Video Player Simulation */}
      {post.type === 'video' && (
        <div className="my-3 rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 aspect-video relative flex items-center justify-center group cursor-pointer"
             onClick={() => setIsPlayingVideo(!isPlayingVideo)}>
          {isPlayingVideo ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 p-4">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
              <p className="text-xs text-neutral-400">Streaming high-definition video...</p>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform z-10">
                <Play className="w-6 h-6 ml-1 fill-white" />
              </div>
              <div className="absolute bottom-3 left-3 text-xs text-white/90 z-10 flex items-center gap-2">
                <span className="font-mono tabular-nums">03:42</span>
                <span>·</span>
                <span>4K Spatial Audio</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Poll */}
      {post.poll && (
        <PollCard poll={post.poll} onVote={(optId) => votePoll(post.id, optId)} />
      )}

      {/* Link Preview */}
      {post.linkPreview && (
        <a
          href={post.linkPreview.url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-3 block rounded-xl overflow-hidden border border-neutral-800/80 bg-[#141824]/50 hover:border-neutral-700 transition-colors group"
        >
          {post.linkPreview.image && (
            <img
              src={post.linkPreview.image}
              alt={post.linkPreview.title}
              referrerPolicy="no-referrer"
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 uppercase tracking-wider mb-1">
              <span>{post.linkPreview.domain}</span>
              <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300" />
            </div>
            <h4 className="text-xs font-semibold text-neutral-100 group-hover:text-indigo-300 transition-colors">
              {post.linkPreview.title}
            </h4>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              {post.linkPreview.description}
            </p>
          </div>
        </a>
      )}

      {/* AI Summary Highlight Box */}
      {showAISummary && (
        <div className="my-3 p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200/90 relative">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>NOVA AI Summary</span>
          </div>
          <p className="leading-relaxed">
            {post.aiSummary ||
              `Key takeaway: ${post.content.slice(0, 140)}...`}
          </p>
          <button
            onClick={() => setShowAISummary(false)}
            className="mt-2 text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
          >
            Dismiss summary
          </button>
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60 text-xs text-neutral-400">
        {/* Like */}
        <button
          onClick={() => toggleLikePost(post.id)}
          className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
            post.isLiked
              ? 'text-rose-400 bg-rose-500/10'
              : 'hover:text-rose-400 hover:bg-neutral-800/40'
          }`}
          aria-label="Like post"
        >
          <Heart
            className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`}
          />
          <span className="font-mono tabular-nums">{post.likes}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
            showComments
              ? 'text-indigo-400 bg-indigo-500/10'
              : 'hover:text-indigo-400 hover:bg-neutral-800/40'
          }`}
          aria-label="View comments"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="font-mono tabular-nums">{post.commentsCount}</span>
        </button>

        {/* Repost */}
        <button
          onClick={() => toggleRepost(post.id)}
          className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
            post.isReposted
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'hover:text-emerald-400 hover:bg-neutral-800/40'
          }`}
          aria-label="Repost"
        >
          <Repeat2 className="w-4 h-4" />
          <span className="font-mono tabular-nums">{post.reposts}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmark(post.id)}
          className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
            post.isBookmarked
              ? 'text-amber-400 bg-amber-500/10'
              : 'hover:text-amber-400 hover:bg-neutral-800/40'
          }`}
          aria-label="Bookmark post"
        >
          <Bookmark
            className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`}
          />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/40 transition-colors cursor-pointer"
          aria-label="Share post"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <CommentSection
          comments={post.comments}
          currentUser={currentUser}
          onAddComment={(content) => addComment(post.id, content)}
          onOpenUserProfile={openUserProfile}
        />
      )}
    </article>
  );
};

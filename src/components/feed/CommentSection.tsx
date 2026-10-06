import React, { useState } from 'react';
import { Send, Heart } from 'lucide-react';
import { Comment, User } from '../../types';
import { Avatar } from '../common/Avatar';

interface CommentSectionProps {
  comments: Comment[];
  currentUser: User;
  onAddComment: (content: string) => void;
  onOpenUserProfile: (userId: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  currentUser,
  onAddComment,
  onOpenUserProfile,
}) => {
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  const toggleCommentLike = (commentId: string) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="mt-3 pt-3 border-t border-neutral-800/60 space-y-3">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Avatar
          src={currentUser.avatar}
          name={currentUser.displayName}
          size="xs"
        />
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Share your perspective..."
          className="flex-1 bg-[#121620] border border-neutral-800 focus:border-indigo-500/80 rounded-xl px-3 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          disabled={!commentText.trim()}
          className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all cursor-pointer"
          title="Send comment"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {comments.map((comment) => {
          const isLiked = likedComments[comment.id];
          const likesCount = (comment.likes || 0) + (isLiked ? 1 : 0);

          return (
            <div
              key={comment.id}
              className="flex items-start gap-2.5 p-2 rounded-xl bg-[#121620]/60 border border-neutral-800/40 text-xs"
            >
              <div
                onClick={() => onOpenUserProfile(comment.author.id)}
                className="cursor-pointer"
              >
                <Avatar
                  src={comment.author.avatar}
                  name={comment.author.displayName}
                  size="xs"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      onClick={() => onOpenUserProfile(comment.author.id)}
                      className="font-medium text-neutral-200 hover:underline cursor-pointer"
                    >
                      {comment.author.displayName}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      @{comment.author.username}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {comment.createdAt}
                  </span>
                </div>

                <p className="text-neutral-300 mt-1 whitespace-pre-line leading-relaxed">
                  {comment.content}
                </p>

                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-neutral-500">
                  <button
                    onClick={() => toggleCommentLike(comment.id)}
                    className={`flex items-center gap-1 transition-colors cursor-pointer ${
                      isLiked ? 'text-rose-400' : 'hover:text-neutral-300'
                    }`}
                  >
                    <Heart
                      className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`}
                    />
                    <span className="font-mono tabular-nums">{likesCount}</span>
                  </button>
                  <button
                    onClick={() => setCommentText(`@${comment.author.username} `)}
                    className="hover:text-neutral-300 transition-colors cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

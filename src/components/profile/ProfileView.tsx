import React, { useState } from 'react';
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  MessageSquare,
  Edit3,
  Star,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { PostCard } from '../feed/PostCard';
import { EditProfileModal } from './EditProfileModal';
import { User } from '../../types';

interface ProfileViewProps {
  userId?: string; // If undefined, displays currentUser
}

type ProfileTab = 'posts' | 'replies' | 'media' | 'likes' | 'projects';

export const ProfileView: React.FC<ProfileViewProps> = ({ userId }) => {
  const {
    currentUser,
    users,
    posts,
    toggleFollowUser,
    updateUserProfile,
    startDirectMessage,
    openAIAssistant,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Target user profile to display
  const targetUser: User =
    userId && userId !== currentUser.id
      ? users.find((u) => u.id === userId) || currentUser
      : currentUser;

  const isSelf = targetUser.id === currentUser.id;

  // Filter posts belonging to or liked by targetUser
  const userPosts = posts.filter((p) => p.author.id === targetUser.id);
  const userMediaPosts = userPosts.filter((p) => p.mediaUrls && p.mediaUrls.length > 0);
  const userLikedPosts = posts.filter((p) => p.isLiked);
  const userReplies = posts.filter((p) =>
    p.comments.some((c) => c.author.id === targetUser.id)
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-6">
      {/* Profile Header Hero Card */}
      <div className="rounded-2xl overflow-hidden bg-[#11151f] border border-neutral-800/80 shadow-md">
        {/* Cover Photo */}
        <div
          className="h-44 sm:h-56 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${
              targetUser.coverImage ||
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
            })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#11151f] via-black/20 to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="p-4 sm:p-6 pt-0 relative">
          {/* Avatar and Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-4 gap-4">
            <div className="ring-4 ring-[#11151f] rounded-full inline-block bg-[#11151f]">
              <Avatar
                src={targetUser.avatar}
                name={targetUser.displayName}
                size="2xl"
                onlineStatus={targetUser.onlineStatus}
              />
            </div>

            <div className="flex items-center gap-2">
              {isSelf ? (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant={targetUser.isFollowing ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => toggleFollowUser(targetUser.id)}
                  >
                    {targetUser.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                    onClick={() => startDirectMessage(targetUser.id)}
                  >
                    Message
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  openAIAssistant(
                    `Analyze the digital identity and contributions of @${targetUser.username} (${targetUser.displayName}) on NOVA.`
                  )
                }
                title="AI Identity Insight"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </Button>
            </div>
          </div>

          {/* User Names & Verification */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {targetUser.displayName}
              </h2>
              {targetUser.isVerified && (
                <span
                  title="Verified Contributor"
                  className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold"
                >
                  ✓
                </span>
              )}
              {targetUser.badgeTitle && (
                <span className="text-xs text-neutral-400 border border-neutral-700/60 rounded px-1.5 py-0.5">
                  {targetUser.badgeTitle}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5 font-mono">
              @{targetUser.username}
            </p>
          </div>

          {/* Bio */}
          <p className="text-sm text-neutral-200 mt-3 max-w-2xl leading-relaxed whitespace-pre-line">
            {targetUser.bio}
          </p>

          {/* Metadata Row (Strict zero-pill discipline) */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-400 mt-4">
            {targetUser.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>{targetUser.location}</span>
              </div>
            )}

            {targetUser.website && (
              <a
                href={targetUser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-indigo-400 hover:underline"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{targetUser.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}

            <div className="flex items-center gap-1.5 text-neutral-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{targetUser.joinedDate}</span>
            </div>
          </div>

          {/* Followers & Following Counters */}
          <div className="flex items-center gap-5 text-xs text-neutral-300 mt-4 pt-3 border-t border-neutral-800/60 font-mono">
            <div>
              <span className="font-semibold text-white mr-1 tabular-nums">
                {targetUser.followersCount.toLocaleString()}
              </span>
              <span className="text-neutral-500 font-sans">Followers</span>
            </div>
            <div>
              <span className="font-semibold text-white mr-1 tabular-nums">
                {targetUser.followingCount.toLocaleString()}
              </span>
              <span className="text-neutral-500 font-sans">Following</span>
            </div>
            {targetUser.projects && (
              <div>
                <span className="font-semibold text-white mr-1 tabular-nums">
                  {targetUser.projects.length}
                </span>
                <span className="text-neutral-500 font-sans">Portfolio Projects</span>
              </div>
            )}
          </div>

          {/* Curated Interests (Unboxed text with dots) */}
          {targetUser.interests && targetUser.interests.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-3 pt-3 border-t border-neutral-800/60 flex-wrap">
              <span className="text-neutral-500 font-medium">Interests:</span>
              {targetUser.interests.map((interest, idx) => (
                <React.Fragment key={interest}>
                  <span className="text-indigo-300">{interest}</span>
                  {idx < targetUser.interests.length - 1 && (
                    <span className="text-neutral-600" aria-hidden="true">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-[#121620] border border-neutral-800/80 rounded-xl overflow-x-auto scrollbar-none">
        {(
          [
            { id: 'posts', label: 'Posts', count: userPosts.length },
            { id: 'projects', label: 'Projects & Portfolio', count: targetUser.projects?.length },
            { id: 'replies', label: 'Replies', count: userReplies.length },
            { id: 'media', label: 'Media', count: userMediaPosts.length },
            { id: 'likes', label: 'Likes', count: isSelf ? userLikedPosts.length : undefined },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProfileTab)}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-neutral-800 text-white shadow-sm shadow-black/20'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="text-[10px] text-neutral-500 font-mono tabular-nums">
                ({tab.count})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div>
            {userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50">
                <p className="text-xs text-neutral-400">
                  No public posts published yet by this user.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Projects / Portfolio Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            {targetUser.projects && targetUser.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {targetUser.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-[#11151f] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-sm font-semibold text-white">
                            {proj.title}
                          </h4>
                        </div>
                        {typeof proj.stars === 'number' && (
                          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="tabular-nums">{proj.stars}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                        {proj.description}
                      </p>

                      {proj.tech && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {proj.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {proj.url && (
                      <div className="pt-3 border-t border-neutral-800/60">
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          <span>Explore Project</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50">
                <p className="text-xs text-neutral-400">
                  No portfolio projects added yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Replies Tab */}
        {activeTab === 'replies' && (
          <div className="space-y-4">
            {userReplies.length > 0 ? (
              userReplies.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50">
                <p className="text-xs text-neutral-400">
                  No discussion replies found.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div>
            {userMediaPosts.length > 0 ? (
              <div className="space-y-4">
                {userMediaPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50">
                <p className="text-xs text-neutral-400">No media attachments found.</p>
              </div>
            )}
          </div>
        )}

        {/* Likes Tab */}
        {activeTab === 'likes' && (
          <div className="space-y-4">
            {userLikedPosts.length > 0 ? (
              userLikedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl border border-neutral-800 bg-[#11151f]/50">
                <p className="text-xs text-neutral-400">No liked posts yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isSelf && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={currentUser}
          onSave={updateUserProfile}
        />
      )}
    </div>
  );
};

export type InterestTag =
  | 'AI'
  | 'Technology'
  | 'Finance'
  | 'Crypto'
  | 'Gaming'
  | 'Music'
  | 'Design'
  | 'Programming'
  | 'Education'
  | 'Lifestyle'
  | 'Business';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location?: string;
  website?: string;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  interests: InterestTag[];
  isVerified?: boolean;
  role?: 'user' | 'creator' | 'admin' | 'moderator';
  isFollowing?: boolean;
  onlineStatus?: 'online' | 'idle' | 'offline';
  badgeTitle?: string;
  projects?: {
    id: string;
    title: string;
    description: string;
    url?: string;
    tech?: string[];
    stars?: number;
  }[];
}

export type PostType = 'text' | 'image' | 'multi_image' | 'poll' | 'link' | 'video';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedId?: string;
  expiresIn?: string;
}

export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  domain: string;
  image?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: User;
  type: PostType;
  content: string;
  createdAt: string;
  mediaUrls?: string[];
  poll?: PollData;
  linkPreview?: LinkPreview;
  videoUrl?: string;
  communityId?: string;
  communityName?: string;
  likes: number;
  reposts: number;
  commentsCount: number;
  comments: Comment[];
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
  tags?: string[];
  pinned?: boolean;
  aiSummary?: string;
}

export type CommunityRole = 'owner' | 'admin' | 'moderator' | 'member';

export interface CommunityMember {
  userId: string;
  user: User;
  role: CommunityRole;
  joinedAt: string;
}

export interface CommunityRule {
  id: string;
  title: string;
  description: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: InterestTag;
  icon: string;
  coverImage: string;
  memberCount: number;
  isJoined?: boolean;
  role?: CommunityRole;
  rules: CommunityRule[];
  moderators: string[]; // user IDs
  createdAt: string;
  isPrivate?: boolean;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  timestamp: string;
  reactions?: MessageReaction[];
  replyToId?: string;
  replyToContent?: string;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: string;
  }[];
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'repost'
  | 'community'
  | 'message';

export interface NotificationItemData {
  id: string;
  type: NotificationType;
  actor: User;
  title: string;
  description?: string;
  targetId?: string; // post ID or community ID
  createdAt: string;
  isRead: boolean;
}

export interface ReportItem {
  id: string;
  reporter: User;
  type: 'post' | 'user' | 'community' | 'comment';
  targetId: string;
  targetTitle: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  notes?: string;
}

export type ActiveTab =
  | 'feed'
  | 'explore'
  | 'communities'
  | 'community_detail'
  | 'messages'
  | 'notifications'
  | 'bookmarks'
  | 'profile'
  | 'user_profile'
  | 'admin';

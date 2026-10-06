import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  Community,
  Conversation,
  Message,
  NotificationItemData,
  ReportItem,
  ActiveTab,
  InterestTag,
} from '../types';
import {
  CURRENT_USER,
  MOCK_USERS,
  MOCK_COMMUNITIES,
  MOCK_POSTS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES_DATA,
  MOCK_NOTIFICATIONS,
  MOCK_REPORTS,
} from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'alert';
}

interface AppContextType {
  currentUser: User;
  users: User[];
  posts: Post[];
  communities: Community[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  notifications: NotificationItemData[];
  reports: ReportItem[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCommunityId: string | null;
  selectedUserId: string | null;
  activeConversationId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Auth state
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isOnboarded: boolean;
  setIsOnboarded: (onboarded: boolean) => void;
  
  // Navigation helpers
  openUserProfile: (userId: string) => void;
  openCommunityDetail: (communityId: string) => void;
  openConversation: (conversationId: string) => void;
  
  // Post actions
  createPost: (postData: {
    content: string;
    type?: Post['type'];
    mediaUrls?: string[];
    poll?: Post['poll'];
    linkPreview?: Post['linkPreview'];
    communityId?: string;
    communityName?: string;
    tags?: string[];
  }) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleRepost: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  addComment: (postId: string, content: string) => void;
  
  // User actions
  toggleFollowUser: (userId: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  
  // Community actions
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  createCommunity: (data: {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    category: InterestTag;
    rules: { id: string; title: string; description: string }[];
  }) => void;
  
  // Message actions
  sendMessage: (conversationId: string, content: string, replyToId?: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  startDirectMessage: (userId: string) => void;
  
  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Admin actions
  resolveReport: (reportId: string) => void;
  dismissReport: (reportId: string) => void;
  
  // AI Modal
  isAIAssistantOpen: boolean;
  aiInitialContext: string;
  openAIAssistant: (initialContext?: string) => void;
  closeAIAssistant: () => void;
  
  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'info' | 'success' | 'alert') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES_DATA);
  const [notifications, setNotifications] = useState<NotificationItemData[]>(MOCK_NOTIFICATIONS);
  const [reports, setReports] = useState<ReportItem[]>(MOCK_REPORTS);
  
  // App navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Auth flow states (Starts authenticated to explore immediately, but can sign out or switch modes)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  
  // AI assistant
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [aiInitialContext, setAiInitialContext] = useState<string>('');
  
  // Toast notifications
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const openUserProfile = (userId: string) => {
    if (userId === currentUser.id) {
      setActiveTab('profile');
      setSelectedUserId(null);
    } else {
      setSelectedUserId(userId);
      setActiveTab('user_profile');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCommunityDetail = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setActiveTab('community_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setActiveTab('messages');
  };

  const openAIAssistant = (initialContext: string = '') => {
    setAiInitialContext(initialContext);
    setIsAIAssistantOpen(true);
  };

  const closeAIAssistant = () => {
    setIsAIAssistantOpen(false);
    setAiInitialContext('');
  };

  // POST ACTIONS
  const createPost = (postData: {
    content: string;
    type?: Post['type'];
    mediaUrls?: string[];
    poll?: Post['poll'];
    linkPreview?: Post['linkPreview'];
    communityId?: string;
    communityName?: string;
    tags?: string[];
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      type: postData.type || 'text',
      content: postData.content,
      createdAt: 'Just now',
      mediaUrls: postData.mediaUrls,
      poll: postData.poll,
      linkPreview: postData.linkPreview,
      communityId: postData.communityId,
      communityName: postData.communityName,
      tags: postData.tags || [],
      likes: 0,
      reposts: 0,
      commentsCount: 0,
      comments: [],
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    showToast('Post published to NOVA feed', 'success');
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Post deleted', 'info');
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
          };
        }
        return post;
      })
    );
  };

  const toggleRepost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isReposted = !post.isReposted;
          return {
            ...post,
            isReposted,
            reposts: isReposted ? post.reposts + 1 : Math.max(0, post.reposts - 1),
          };
        }
        return post;
      })
    );
    showToast('Post reshared to your network', 'info');
  };

  const toggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isBookmarked = !post.isBookmarked;
          showToast(
            isBookmarked ? 'Saved to Bookmarks' : 'Removed from Bookmarks',
            'info'
          );
          return {
            ...post,
            isBookmarked,
          };
        }
        return post;
      })
    );
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.poll && !post.poll.userVotedId) {
          const updatedOptions = post.poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...post,
            poll: {
              ...post.poll,
              options: updatedOptions,
              totalVotes: post.poll.totalVotes + 1,
              userVotedId: optionId,
            },
          };
        }
        return post;
      })
    );
    showToast('Vote recorded anonymously', 'success');
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;

    const newComment = {
      id: `c_${Date.now()}`,
      postId,
      author: currentUser,
      content,
      createdAt: 'Just now',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [newComment, ...post.comments],
          };
        }
        return post;
      })
    );
    showToast('Comment posted', 'success');
  };

  // USER ACTIONS
  const toggleFollowUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          const isFollowing = !user.isFollowing;
          showToast(
            isFollowing ? `Following @${user.username}` : `Unfollowed @${user.username}`,
            'info'
          );
          return {
            ...user,
            isFollowing,
            followersCount: isFollowing
              ? user.followersCount + 1
              : Math.max(0, user.followersCount - 1),
          };
        }
        return user;
      })
    );

    // Update followers count of current user if applicable
    setCurrentUser((prev) => ({
      ...prev,
      followingCount: users.find((u) => u.id === userId)?.isFollowing
        ? Math.max(0, prev.followingCount - 1)
        : prev.followingCount + 1,
    }));
  };

  const updateUserProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
    showToast('Profile updated successfully', 'success');
  };

  // COMMUNITY ACTIONS
  const joinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, isJoined: true, memberCount: c.memberCount + 1 }
          : c
      )
    );
    showToast('Joined community', 'success');
  };

  const leaveCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, isJoined: false, memberCount: Math.max(0, c.memberCount - 1) }
          : c
      )
    );
    showToast('Left community', 'info');
  };

  const createCommunity = (data: {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    category: InterestTag;
    rules: { id: string; title: string; description: string }[];
  }) => {
    const newCommunity: Community = {
      id: `c_${Date.now()}`,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      tagline: data.tagline,
      description: data.description,
      category: data.category,
      icon: 'Users',
      coverImage: communities[0]?.coverImage || '',
      memberCount: 1,
      isJoined: true,
      role: 'owner',
      rules: data.rules,
      moderators: [currentUser.id],
      createdAt: 'Just now',
    };

    setCommunities((prev) => [newCommunity, ...prev]);
    setSelectedCommunityId(newCommunity.id);
    setActiveTab('community_detail');
    showToast(`Created community: ${data.name}`, 'success');
  };

  // MESSAGES
  const sendMessage = (conversationId: string, content: string, replyToId?: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      sender: currentUser,
      content,
      timestamp: 'Just now',
      replyToId,
      isRead: true,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: newMessage,
              updatedAt: 'Just now',
            }
          : c
      )
    );

    // Realistic auto-reply simulation if talking to Elena or Marcus after 2.5s
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv && !conv.isGroup) {
      const otherUser = conv.participants.find((p) => p.id !== currentUser.id);
      if (otherUser) {
        setTimeout(() => {
          const botReply: Message = {
            id: `m_reply_${Date.now()}`,
            conversationId,
            senderId: otherUser.id,
            sender: otherUser,
            content: `Understood! I will check that out shortly. Let's touch base again once the test runs complete.`,
            timestamp: 'Just now',
            isRead: false,
          };
          setMessages((prev) => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), botReply],
          }));
          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: botReply,
                    unreadCount: c.unreadCount + 1,
                    updatedAt: 'Just now',
                  }
                : c
            )
          );
        }, 2500);
      }
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) => {
      const updated = { ...prev };
      for (const convId in updated) {
        updated[convId] = updated[convId].map((msg) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || [];
            const existing = reactions.find((r) => r.emoji === emoji);
            if (existing) {
              return {
                ...msg,
                reactions: reactions.map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1 } : r
                ),
              };
            } else {
              return {
                ...msg,
                reactions: [...reactions, { emoji, count: 1, users: [currentUser.id] }],
              };
            }
          }
          return msg;
        });
      }
      return updated;
    });
  };

  const startDirectMessage = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    // Check if conversation already exists
    const existing = conversations.find(
      (c) =>
        !c.isGroup &&
        c.participants.some((p) => p.id === userId) &&
        c.participants.some((p) => p.id === currentUser.id)
    );

    if (existing) {
      setActiveConversationId(existing.id);
      setActiveTab('messages');
      return;
    }

    // Create new conversation
    const newConvId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      isGroup: false,
      participants: [currentUser, targetUser],
      unreadCount: 0,
      updatedAt: 'Just now',
      lastMessage: undefined,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({ ...prev, [newConvId]: [] }));
    setActiveConversationId(newConvId);
    setActiveTab('messages');
  };

  // NOTIFICATIONS
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  // ADMIN
  const resolveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
    showToast('Report marked as resolved', 'success');
  };

  const dismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
    );
    showToast('Report dismissed', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        posts,
        communities,
        conversations,
        messages,
        notifications,
        reports,
        activeTab,
        setActiveTab,
        selectedCommunityId,
        selectedUserId,
        activeConversationId,
        searchQuery,
        setSearchQuery,
        isAuthenticated,
        setIsAuthenticated,
        isOnboarded,
        setIsOnboarded,
        openUserProfile,
        openCommunityDetail,
        openConversation,
        createPost,
        deletePost,
        toggleLikePost,
        toggleRepost,
        toggleBookmark,
        votePoll,
        addComment,
        toggleFollowUser,
        updateUserProfile,
        joinCommunity,
        leaveCommunity,
        createCommunity,
        sendMessage,
        addReaction,
        startDirectMessage,
        markNotificationRead,
        markAllNotificationsRead,
        resolveReport,
        dismissReport,
        isAIAssistantOpen,
        aiInitialContext,
        openAIAssistant,
        closeAIAssistant,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

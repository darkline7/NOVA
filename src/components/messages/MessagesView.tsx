import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  Reply,
  CheckCheck,
  Image,
  Users,
  MoreVertical,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { Conversation, Message } from '../../types';

export const MessagesView: React.FC = () => {
  const {
    currentUser,
    conversations,
    messages,
    activeConversationId,
    openConversation,
    sendMessage,
    addReaction,
    openUserProfile,
    showToast,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [searchConvQuery, setSearchConvQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(Boolean(activeConversationId));

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const currentMessages = activeConversationId
    ? messages[activeConversationId] || []
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversationId) return;

    sendMessage(
      activeConversationId,
      messageInput.trim(),
      replyingTo?.id
    );
    setMessageInput('');
    setReplyingTo(null);
  };

  const handleAttachMockImage = () => {
    if (!activeConversationId) return;
    sendMessage(
      activeConversationId,
      'Attached architectural schema and benchmarks for review.'
    );
    setShowAttachmentMenu(false);
    showToast('Attachment uploaded to conversation', 'info');
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (!searchConvQuery.trim()) return true;
    const q = searchConvQuery.toLowerCase();
    if (c.name?.toLowerCase().includes(q)) return true;
    return c.participants.some(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q)
    );
  });

  // Get other participant in DM
  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find((p) => p.id !== currentUser.id) || conv.participants[0];
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-60px)] lg:h-[calc(100vh-80px)] p-2 sm:p-4 flex gap-4">
      {/* Conversations List Pane */}
      <div
        className={`w-full md:w-80 lg:w-96 shrink-0 flex flex-col rounded-2xl bg-[#11151f] border border-neutral-800/80 overflow-hidden ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Messages
            </h2>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              {conversations.length} active chats
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchConvQuery}
              onChange={(e) => setSearchConvQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-[#121620] border border-neutral-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/40">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConversationId;
            const otherUser = getOtherParticipant(conv);

            return (
              <div
                key={conv.id}
                onClick={() => {
                  openConversation(conv.id);
                  setMobileShowChat(true);
                }}
                className={`flex items-start gap-3 p-3.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-neutral-800/70 border-l-2 border-indigo-500'
                    : 'hover:bg-neutral-800/30'
                }`}
              >
                {conv.isGroup ? (
                  <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                ) : (
                  <Avatar
                    src={otherUser.avatar}
                    name={otherUser.displayName}
                    size="md"
                    onlineStatus={otherUser.onlineStatus}
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="text-xs font-semibold text-neutral-100 truncate">
                      {conv.isGroup ? conv.name : otherUser.displayName}
                    </p>
                    <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                      {conv.updatedAt}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 truncate">
                    {conv.lastMessage?.content || 'Started conversation'}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-mono shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Chat Conversation Pane */}
      <div
        className={`flex-1 flex flex-col rounded-2xl bg-[#11151f] border border-neutral-800/80 overflow-hidden ${
          !mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConv ? (
          <>
            {/* Chat Top Header */}
            <div className="p-3.5 border-b border-neutral-800/80 flex items-center justify-between bg-[#11151f]/90">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white"
                  aria-label="Back to messages list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {activeConv.isGroup ? (
                  <div className="w-9 h-9 rounded-full bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                ) : (
                  <Avatar
                    src={getOtherParticipant(activeConv).avatar}
                    name={getOtherParticipant(activeConv).displayName}
                    size="sm"
                    onlineStatus={getOtherParticipant(activeConv).onlineStatus}
                    onClick={() =>
                      openUserProfile(getOtherParticipant(activeConv).id)
                    }
                  />
                )}

                <div>
                  <h3 className="text-xs font-semibold text-white">
                    {activeConv.isGroup
                      ? activeConv.name
                      : getOtherParticipant(activeConv).displayName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                    {activeConv.isGroup ? (
                      <span>{activeConv.participants.length} participants</span>
                    ) : (
                      <>
                        <span className="capitalize">
                          {getOtherParticipant(activeConv).onlineStatus ||
                            'offline'}
                        </span>
                        <span>·</span>
                        <span>@{getOtherParticipant(activeConv).username}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button className="p-1.5 text-neutral-500 hover:text-neutral-300">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {currentMessages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isMine ? 'items-end' : 'items-start'
                    } group`}
                  >
                    <div
                      className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${
                        isMine ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {!isMine && (
                        <Avatar
                          src={msg.sender.avatar}
                          name={msg.sender.displayName}
                          size="xs"
                        />
                      )}

                      <div
                        className={`rounded-2xl p-3 text-xs leading-relaxed ${
                          isMine
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-[#181d2a] text-neutral-200 border border-neutral-800 rounded-bl-xs'
                        }`}
                      >
                        {/* If reply to another message */}
                        {msg.replyToId && (
                          <div className="mb-2 p-1.5 rounded-lg bg-black/20 text-[11px] text-neutral-300 border-l-2 border-indigo-400">
                            Replying to earlier message
                          </div>
                        )}

                        <p className="whitespace-pre-line">{msg.content}</p>

                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono ${
                            isMine ? 'text-indigo-200' : 'text-neutral-500'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isMine && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>

                      {/* Quick Reaction & Reply triggers on hover */}
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button
                          onClick={() => setReplyingTo(msg)}
                          className="p-1 rounded text-neutral-500 hover:text-white"
                          title="Reply"
                        >
                          <Reply className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => addReaction(msg.id, '🔥')}
                          className="p-1 rounded text-neutral-500 hover:text-amber-400 text-xs"
                          title="React 🔥"
                        >
                          🔥
                        </button>
                        <button
                          onClick={() => addReaction(msg.id, '❤️')}
                          className="p-1 rounded text-neutral-500 hover:text-rose-400 text-xs"
                          title="React ❤️"
                        >
                          ❤️
                        </button>
                      </div>
                    </div>

                    {/* Reactions display underneath message */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div
                        className={`flex items-center gap-1 mt-1 ${
                          isMine ? 'pr-8' : 'pl-8'
                        }`}
                      >
                        {msg.reactions.map((r, i) => (
                          <button
                            key={i}
                            onClick={() => addReaction(msg.id, r.emoji)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#181d2a] border border-neutral-700/60 text-[11px] cursor-pointer"
                          >
                            <span>{r.emoji}</span>
                            <span className="font-mono text-[10px] text-neutral-400">
                              {r.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Replying banner */}
            {replyingTo && (
              <div className="px-4 py-2 bg-[#141824] border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
                <div className="truncate">
                  <span className="text-indigo-400 font-medium">Replying to {replyingTo.sender.displayName}: </span>
                  <span className="text-neutral-400 truncate">{replyingTo.content}</span>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-neutral-500 hover:text-white ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-neutral-800/80 bg-[#11151f] flex items-center gap-2 relative"
            >
              {/* Attachment popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Attach file or media"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {showAttachmentMenu && (
                  <div className="absolute left-0 bottom-full mb-2 w-48 rounded-xl bg-[#141824] border border-neutral-800 p-1 shadow-xl z-20 text-xs">
                    <button
                      type="button"
                      onClick={handleAttachMockImage}
                      className="w-full text-left px-3 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <Image className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Upload Code/Media</span>
                    </button>
                  </div>
                )}
              </div>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#141924] border border-neutral-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setMessageInput((prev) => `${prev} 👍`)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white"
                title="Quick thumbs up"
              >
                <Smile className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all cursor-pointer"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500">
            <Search className="w-8 h-8 mb-2" />
            <p className="text-sm font-semibold text-neutral-300">
              No conversation selected
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Pick a discussion from the list or start a direct message with a creator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

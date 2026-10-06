import React, { useState } from 'react';
import {
  Image,
  BarChart2,
  Sparkles,
  Link2,
  X,
  Send,
  Plus,
  Trash2,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { PostType, PollOption } from '../../types';

interface PostComposerProps {
  onSuccess?: () => void;
  defaultCommunityId?: string;
  defaultCommunityName?: string;
  isModal?: boolean;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  onSuccess,
  defaultCommunityId,
  defaultCommunityName,
  isModal = false,
}) => {
  const { currentUser, communities, createPost, showToast } = useApp();

  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('text');
  const [selectedCommunity, setSelectedCommunity] = useState<string>(
    defaultCommunityId || ''
  );
  
  // Media state
  const [imageUrl, setImageUrl] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [showImageInput, setShowImageInput] = useState(false);

  // Poll state
  const [showPollInput, setShowPollInput] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>([
    'Option 1',
    'Option 2',
  ]);

  // Tags
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showTagsInput, setShowTagsInput] = useState(false);

  // Link preview state
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  // AI Assistance loading
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

  const handleAddMedia = () => {
    if (!imageUrl.trim()) return;
    setMediaUrls((prev) => [...prev, imageUrl.trim()]);
    setImageUrl('');
    setShowImageInput(false);
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions((prev) => [...prev, `Option ${prev.length + 1}`]);
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    setPollOptions((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleAddTag = () => {
    const cleaned = tagsInput.trim().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned)) {
      setTags((prev) => [...prev, cleaned]);
      setTagsInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // AI helper functions
  const handleAIEnhanceWriting = () => {
    if (!content.trim()) {
      showToast('Please type some draft text first', 'alert');
      return;
    }
    setIsAILoading(true);
    setAiMenuOpen(false);

    setTimeout(() => {
      // Clean, professional polish
      const enhanced = `${content.trim()}\n\nKey takeaway: Focused simplicity and deliberate engineering outlast ephemeral noise.`;
      setContent(enhanced);
      setIsAILoading(false);
      showToast('Polished tone & structure with NOVA AI', 'success');
    }, 900);
  };

  const handleAIGenerateHook = () => {
    setIsAILoading(true);
    setAiMenuOpen(false);

    setTimeout(() => {
      const hooks = [
        `Exploring the intersection of scalable architectures and personalized identity systems on NOVA.\n\nHere are 3 architectural patterns we tested this week:`,
        `The difference between high-signal online discourse and algorithmic dopamine feeds comes down to one design choice:\n\n`,
        `Real-world performance breakdown: Why low-latency interfaces and zero-pill metadata improve reading speed by 40%.`,
      ];
      const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
      setContent((prev) => (prev ? `${randomHook}\n\n${prev}` : randomHook));
      setIsAILoading(false);
      showToast('Generated thoughtful post hook', 'success');
    }, 800);
  };

  const handleAICheckSafety = () => {
    setIsAILoading(true);
    setAiMenuOpen(false);

    setTimeout(() => {
      setIsAILoading(false);
      showToast('Content Scan: 100% High signal, zero toxicity, verified compliant', 'success');
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0 && !showPollInput) return;

    let targetType: PostType = 'text';
    if (showPollInput && pollQuestion.trim()) {
      targetType = 'poll';
    } else if (mediaUrls.length > 1) {
      targetType = 'multi_image';
    } else if (mediaUrls.length === 1) {
      targetType = 'image';
    } else if (linkUrl.trim()) {
      targetType = 'link';
    }

    const pollData =
      targetType === 'poll'
        ? {
            question: pollQuestion.trim() || 'Community Poll',
            options: pollOptions.map((opt, i) => ({
              id: `opt_${i + 1}`,
              text: opt,
              votes: 0,
            })),
            totalVotes: 0,
            expiresIn: '3 days left',
          }
        : undefined;

    const commObj = communities.find((c) => c.id === selectedCommunity);

    createPost({
      content: content.trim(),
      type: targetType,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      poll: pollData,
      linkPreview: linkUrl.trim()
        ? {
            url: linkUrl.trim(),
            title: 'Shared Resource via NOVA',
            description: linkUrl.trim(),
            domain: new URL(
              linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
            ).hostname || 'external-link',
          }
        : undefined,
      communityId: commObj?.id,
      communityName: commObj?.name,
      tags: tags.length > 0 ? tags : undefined,
    });

    // Reset form
    setContent('');
    setMediaUrls([]);
    setShowPollInput(false);
    setShowImageInput(false);
    setShowLinkInput(false);
    setShowTagsInput(false);
    setTags([]);
    setLinkUrl('');
    setPollQuestion('');

    if (onSuccess) onSuccess();
  };

  return (
    <div
      className={`rounded-2xl border border-neutral-800/80 bg-[#11151f] p-4 ${
        isModal ? '' : 'mb-6 shadow-sm shadow-black/10'
      }`}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Author Header & Destination Selector */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={currentUser.avatar}
              name={currentUser.displayName}
              size="sm"
              onlineStatus="online"
            />
            <div>
              <p className="text-xs font-semibold text-neutral-200">
                {currentUser.displayName}
              </p>
              <p className="text-[11px] text-neutral-500">
                @{currentUser.username}
              </p>
            </div>
          </div>

          {/* Community Destination Picker */}
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="bg-[#141924] border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Public NOVA Feed</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What are you building, thinking or discovering?"
            rows={isModal ? 4 : 3}
            className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 border-0 focus:outline-none focus:ring-0 resize-none leading-relaxed"
          />
        </div>

        {/* Attached Media previews */}
        {mediaUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {mediaUrls.map((url, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden group">
                <img
                  src={url}
                  alt={`Attachment ${i}`}
                  className="w-20 h-20 object-cover rounded-lg border border-neutral-700"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(i)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Image URL input prompt */}
        {showImageInput && (
          <div className="p-3 rounded-xl bg-[#141924] border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Add Image URL or Artifact</span>
              <button
                type="button"
                onClick={() => setShowImageInput(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... (or image URL)"
                className="flex-1 bg-[#10141d] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleAddMedia}
              >
                Attach
              </Button>
            </div>
          </div>
        )}

        {/* Poll input configuration */}
        {showPollInput && (
          <div className="p-3.5 rounded-xl bg-[#141924] border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-neutral-300">
              <span className="font-medium">Create Interactive Poll</span>
              <button
                type="button"
                onClick={() => setShowPollInput(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Ask a community question..."
              className="w-full bg-[#10141d] border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
            />
            <div className="space-y-2">
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handlePollOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 bg-[#10141d] border border-neutral-800 rounded-lg px-3 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(i)}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {pollOptions.length < 4 && (
              <button
                type="button"
                onClick={handleAddPollOption}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add option
              </button>
            )}
          </div>
        )}

        {/* Link Input */}
        {showLinkInput && (
          <div className="p-3 rounded-xl bg-[#141924] border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Attach Web Link</span>
              <button
                type="button"
                onClick={() => setShowLinkInput(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://your-project-link.dev"
              className="w-full bg-[#10141d] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Tags management */}
        {showTagsInput && (
          <div className="p-3 rounded-xl bg-[#141924] border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Add Topic Hashtags</span>
              <button
                type="button"
                onClick={() => setShowTagsInput(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="AI, TypeScript, Trading..."
                className="flex-1 bg-[#10141d] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 rounded-md px-2 py-0.5"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer toolbar & AI Actions */}
        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between flex-wrap gap-2">
          {/* Quick attachment toggles */}
          <div className="flex items-center gap-1 text-neutral-400">
            <button
              type="button"
              onClick={() => {
                setShowImageInput(!showImageInput);
                setShowPollInput(false);
              }}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                showImageInput || mediaUrls.length > 0
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
              title="Add Image"
            >
              <Image className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowPollInput(!showPollInput);
                setShowImageInput(false);
              }}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                showPollInput
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
              title="Create Poll"
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowLinkInput(!showLinkInput)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                showLinkInput
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
              title="Add Link"
            >
              <Link2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowTagsInput(!showTagsInput)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                showTagsInput || tags.length > 0
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
              title="Add Tags"
            >
              <Tag className="w-4 h-4" />
            </button>

            {/* NOVA AI Magic Assistant Popover Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAiMenuOpen(!aiMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-700/30 text-xs font-medium transition-colors cursor-pointer"
                title="NOVA AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">AI Assist</span>
              </button>

              {aiMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-56 rounded-xl bg-[#141824] border border-neutral-800 shadow-xl py-1 z-30 text-xs">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 border-b border-neutral-800">
                    NOVA AI Writing Tools
                  </div>
                  <button
                    type="button"
                    onClick={handleAIEnhanceWriting}
                    className="w-full text-left px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Improve writing & tone</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAIGenerateHook}
                    className="w-full text-left px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Generate compelling hook</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAICheckSafety}
                    className="w-full text-left px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Content safety & quality scan</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="sm"
            variant="primary"
            isLoading={isAILoading}
            disabled={!content.trim() && mediaUrls.length === 0 && !pollQuestion.trim()}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

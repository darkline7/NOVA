import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Users, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { INTEREST_TAGS } from '../../data/mockData';
import { InterestTag } from '../../types';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const {
    users,
    communities,
    currentUser,
    updateUserProfile,
    toggleFollowUser,
    joinCommunity,
    leaveCommunity,
    showToast,
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedInterests, setSelectedInterests] = useState<InterestTag[]>([
    'AI',
    'Technology',
    'Design',
  ]);

  const toggleInterest = (tag: InterestTag) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleNextStep = () => {
    if (selectedInterests.length === 0) {
      showToast('Please select at least 1 interest to tailor your feed', 'alert');
      return;
    }
    updateUserProfile({ interests: selectedInterests });
    setStep(2);
  };

  const handleFinish = () => {
    showToast('Your personalized NOVA experience is ready!', 'success');
    onComplete();
  };

  // Recommended people based on interests
  const suggestedUsers = users.filter((u) => u.id !== currentUser.id).slice(0, 3);
  const suggestedComms = communities.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#11151f] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              N
            </div>
            <span className="font-semibold text-white">NOVA Onboarding</span>
          </div>
          <span className="font-mono">Step {step} of 2</span>
        </div>

        {step === 1 ? (
          /* Step 1: Select Interests */
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Select your core interests
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                NOVA prioritizes high-signal conversations aligned with what you actually care about.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {INTEREST_TAGS.map((tag) => {
                const isSelected = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                        : 'bg-[#141924] border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-mono">
                {selectedInterests.length} topics selected
              </span>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNextStep}
              >
                Continue to Recommendations
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Recommend People & Communities */
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Recommended for you
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Curated practitioners and rooms matching your selected topics.
              </p>
            </div>

            {/* Creators */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Creators to Follow
              </h3>
              <div className="space-y-2">
                {suggestedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 rounded-xl bg-[#141924] border border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Avatar src={user.avatar} name={user.displayName} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {user.displayName}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          @{user.username} · {user.badgeTitle || 'Creator'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollowUser(user.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                        user.isFollowing
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Communities */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Rooms to Join
              </h3>
              <div className="space-y-2">
                {suggestedComms.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-[#141924] border border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {c.tagline}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        c.isJoined ? leaveCommunity(c.id) : joinCommunity(c.id)
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer shrink-0 ${
                        c.isJoined
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {c.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-end gap-3">
              <Button
                variant="primary"
                size="md"
                rightIcon={<Sparkles className="w-4 h-4" />}
                onClick={handleFinish}
              >
                Enter NOVA Feed
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

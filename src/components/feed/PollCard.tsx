import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PollData } from '../../types';

interface PollCardProps {
  poll: PollData;
  onVote: (optionId: string) => void;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, onVote }) => {
  const hasVoted = Boolean(poll.userVotedId);

  return (
    <div className="my-3 p-3.5 rounded-xl bg-[#141924]/70 border border-neutral-800/80 space-y-2.5">
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
        <span className="font-medium text-neutral-300">{poll.question}</span>
        {poll.expiresIn && (
          <span className="text-[11px] font-mono text-neutral-500">
            {poll.expiresIn}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {poll.options.map((option) => {
          const isSelected = poll.userVotedId === option.id;
          const percentage =
            poll.totalVotes > 0
              ? Math.round((option.votes / poll.totalVotes) * 100)
              : 0;

          return (
            <button
              key={option.id}
              disabled={hasVoted}
              onClick={() => onVote(option.id)}
              className={`relative w-full text-left p-2.5 rounded-lg border transition-all overflow-hidden cursor-pointer disabled:cursor-default ${
                isSelected
                  ? 'border-indigo-500/60 bg-indigo-950/20 text-white font-medium'
                  : 'border-neutral-800 bg-[#121620] hover:border-neutral-700 text-neutral-200'
              }`}
            >
              {/* Progress bar background */}
              {hasVoted && (
                <div
                  className={`absolute left-0 top-0 bottom-0 transition-all duration-500 rounded-lg ${
                    isSelected ? 'bg-indigo-600/25' : 'bg-neutral-800/40'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative flex items-center justify-between gap-2 z-10 text-xs">
                <div className="flex items-center gap-2 truncate">
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  )}
                  <span className="truncate">{option.text}</span>
                </div>

                {hasVoted && (
                  <span className="font-mono tabular-nums text-neutral-400 shrink-0">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500 font-mono tabular-nums">
        <span>{poll.totalVotes.toLocaleString()} votes</span>
        {hasVoted && <span className="text-indigo-400/90">Vote submitted</span>}
      </div>
    </div>
  );
};

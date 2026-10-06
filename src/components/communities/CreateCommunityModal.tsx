import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { InterestTag } from '../../types';
import { INTEREST_TAGS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createCommunity } = useApp();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<InterestTag>('AI');
  const [rules, setRules] = useState([
    { id: 'r1', title: 'Ground discussions with evidence', description: 'Provide reproducible sources or clear rationale.' },
    { id: 'r2', title: 'Respectful technical discourse', description: 'Be constructive, candid and open to debate.' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createCommunity({
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      rules,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a Community"
      description="Launch a high-signal topic room for creators, builders and specialists."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input
          label="Community Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Distributed Consensus Labs"
          required
        />

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as InterestTag)}
            className="w-full bg-[#12161f] border border-neutral-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-neutral-200"
          >
            {INTEREST_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Tagline (1 sentence hook)"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="e.g. Exploring Byzantine fault tolerance and DAG protocols"
        />

        <Textarea
          label="Detailed Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Explain the purpose of this community, what members can expect to learn or share..."
        />

        <div className="pt-2 border-t border-neutral-800">
          <label className="block text-xs font-medium text-neutral-300 mb-2">
            Default Community Rules
          </label>
          <div className="space-y-2">
            {rules.map((rule, idx) => (
              <div
                key={rule.id}
                className="p-2.5 rounded-lg bg-[#141924] border border-neutral-800"
              >
                <p className="font-semibold text-neutral-200 text-xs">
                  {idx + 1}. {rule.title}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Launch Community
          </Button>
        </div>
      </form>
    </Modal>
  );
};

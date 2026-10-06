import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Users,
  Compass,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Play,
  Flame,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { AuthModal } from '../auth/AuthModal';
import { useApp } from '../../context/AppContext';
import { heroAbstract } from '../../data/mockData';

export const LandingPage: React.FC = () => {
  const {
    setIsAuthenticated,
    setIsOnboarded,
    communities,
    users,
    openUserProfile,
    openCommunityDetail,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleEnterDemo = () => {
    setIsAuthenticated(true);
    setIsOnboarded(true);
  };

  const handleCompleteAuth = (isNewUser: boolean) => {
    setIsAuthenticated(true);
    if (isNewUser) {
      setIsOnboarded(false); // triggers onboarding flow
    } else {
      setIsOnboarded(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-neutral-100 selection:bg-indigo-500/30">
      {/* Top Bar Contract (3 zones strictly) */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-[#0b0e14]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <span className="text-white font-extrabold text-base tracking-wider font-display">
              N
            </span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            NOVA
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-400">
          <a href="#about" className="hover:text-white transition-colors">
            Architecture
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#communities" className="hover:text-white transition-colors">
            Communities
          </a>
          <a href="#creators" className="hover:text-white transition-colors">
            Creators
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuth('login')}
            className="text-xs font-medium text-neutral-300 hover:text-white transition-colors px-3 py-2 cursor-pointer"
          >
            Sign In
          </button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => openAuth('signup')}
          >
            Join NOVA
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Next-Generation Social Network</span>
            <span className="text-neutral-500">·</span>
            <span className="text-indigo-400 font-mono">v1.0 Live</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
            Your identity. Your interests. <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-white bg-clip-text text-transparent">Your world.</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A social network designed for Gen Z, developers, researchers, and creators.
            Zero algorithmic outrage. Refined typography, focused micro-communities, and built-in AI discovery.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => openAuth('signup')}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="secondary"
              leftIcon={<Play className="w-4 h-4 text-indigo-400" />}
              onClick={handleEnterDemo}
            >
              Explore Live Feed
            </Button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-neutral-500 font-mono">
            <span>✓ No algorithmic rage-bait</span>
            <span>✓ Built-in AI co-pilot</span>
            <span>✓ Digital identity & portfolio</span>
          </div>
        </div>

        {/* Hero Visual Asset Showcase */}
        <div className="mt-12 md:mt-16 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800/80 shadow-2xl bg-[#11151f]">
          <div className="p-3 bg-[#141924]/80 border-b border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              nova.network/feed
            </span>
            <div className="w-12" />
          </div>

          <div className="relative">
            <img
              src={heroAbstract}
              alt="NOVA Platform Interface"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover max-h-[480px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-80" />
            
            {/* Overlay card */}
            <div className="absolute bottom-6 left-6 right-6 max-w-md p-4 rounded-xl bg-[#11151f]/90 border border-neutral-700/60 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Avatar
                  name="Dr. Elena Rostova"
                  size="sm"
                  onlineStatus="online"
                />
                <div>
                  <h4 className="text-xs font-semibold text-white">Dr. Elena Rostova</h4>
                  <p className="text-[10px] text-neutral-400 font-mono">Senior AI Research Scientist</p>
                </div>
              </div>
              <p className="text-xs text-neutral-300 line-clamp-2">
                &ldquo;We ran an extensive evaluation of local quantization techniques across 4 dynamic MoE architectures...&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 border-t border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-white font-display">
            Built for signal, not addiction
          </h2>
          <p className="text-sm text-neutral-400">
            Every architectural decision inside NOVA protects your cognitive clarity while connecting you with peers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#11151f] border border-neutral-800/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white font-display">
              Identity + Portfolio First
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your profile is not just a feed of hot takes. Showcase your open-source projects, interactive tools, research papers, and verified achievements in one place.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11151f] border border-neutral-800/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white font-display">
              Micro-Communities
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Focused spaces centered on AI, quantitative trading, game development, systems programming, and modern design. No generic feed pollution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11151f] border border-neutral-800/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white font-display">
              Integrated Intelligence
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              NOVA AI summarizes dense technical threads, assists your writing tone, explains why topics are trending, and screens out scam and bot noise.
            </p>
          </div>
        </div>
      </section>

      {/* Community Showcase */}
      <section id="communities" className="py-20 border-t border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white font-display">
              Active Communities
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Join thousands of specialized practitioners already collaborating on NOVA.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleEnterDemo}
          >
            Explore All Rooms
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.slice(0, 3).map((c) => (
            <div
              key={c.id}
              onClick={handleEnterDemo}
              className="p-5 rounded-2xl bg-[#11151f] border border-neutral-800/80 hover:border-neutral-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-indigo-400 border border-indigo-900/60 px-2 py-0.5 rounded">
                  {c.category}
                </span>
                <span className="text-xs text-neutral-500 font-mono tabular-nums">
                  {c.memberCount.toLocaleString()} members
                </span>
              </div>
              <h4 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                {c.name}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                {c.tagline}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Creator Showcase */}
      <section id="creators" className="py-20 border-t border-neutral-800/80 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl font-bold text-white font-display">
            Meet the Builders
          </h2>
          <p className="text-sm text-neutral-400">
            Engineers, designers, quant researchers, and founders building the future in the open.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.slice(0, 4).map((u) => (
            <div
              key={u.id}
              onClick={handleEnterDemo}
              className="p-5 rounded-2xl bg-[#11151f] border border-neutral-800/80 hover:border-neutral-700 transition-all cursor-pointer text-center group"
            >
              <div className="flex justify-center mb-3">
                <Avatar src={u.avatar} name={u.displayName} size="xl" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300">
                {u.displayName}
              </h4>
              <p className="text-[11px] text-neutral-500 font-mono">
                @{u.username}
              </p>
              <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                {u.bio}
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-800/60 text-[11px] font-mono text-neutral-500">
                {u.followersCount.toLocaleString()} followers
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 border-t border-neutral-800/80 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Ready to experience a modern social network?
        </h2>
        <p className="text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Create your digital identity on NOVA today. Join focused rooms, discover high-signal thinking, and build meaningful connections.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            size="lg"
            variant="primary"
            onClick={() => openAuth('signup')}
          >
            Create Your Account
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleEnterDemo}
          >
            Explore Live App
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-8 px-6 text-center text-xs text-neutral-500 font-mono">
        <p>NOVA © 2026 · Your identity. Your interests. Your world.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onCompleteAuth={handleCompleteAuth}
      />
    </div>
  );
};

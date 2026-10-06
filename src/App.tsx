import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Feed } from './components/feed/Feed';
import { ExploreView } from './components/explore/ExploreView';
import { CommunityView } from './components/communities/CommunityView';
import { MessagesView } from './components/messages/MessagesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { BookmarksView } from './components/bookmarks/BookmarksView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingFlow } from './components/auth/OnboardingFlow';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { AIFloatingTrigger } from './components/ai/AIFloatingTrigger';
import { Toast } from './components/common/Toast';
import { Modal } from './components/common/Modal';
import { PostComposer } from './components/feed/PostComposer';

const MainAppContent: React.FC = () => {
  const {
    isAuthenticated,
    isOnboarded,
    setIsOnboarded,
    activeTab,
    selectedUserId,
  } = useApp();

  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);

  // If unauthenticated: show high-impact Landing Page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // If authenticated but needs onboarding: show Onboarding Flow
  if (!isOnboarded) {
    return <OnboardingFlow onComplete={() => setIsOnboarded(true)} />;
  }

  // Main Authenticated Application Canvas
  return (
    <div className="min-h-screen bg-[#0b0e14] text-neutral-100 flex flex-col justify-between">
      <div className="flex w-full max-w-[1536px] mx-auto min-h-screen">
        {/* Left Sidebar (Desktop) */}
        <Sidebar onOpenCreatePost={() => setCreatePostModalOpen(true)} />

        {/* Center Main View Area */}
        <main className="flex-1 min-w-0 border-r border-neutral-800/80 pb-20 lg:pb-8 flex flex-col">
          {/* Top Bar / Mobile Header */}
          <Navbar onOpenCreatePost={() => setCreatePostModalOpen(true)} />

          {/* Active View Container */}
          <div className="flex-1">
            {activeTab === 'feed' && <Feed />}
            {activeTab === 'explore' && <ExploreView />}
            {(activeTab === 'communities' || activeTab === 'community_detail') && (
              <CommunityView />
            )}
            {activeTab === 'messages' && <MessagesView />}
            {activeTab === 'notifications' && <NotificationsView />}
            {activeTab === 'bookmarks' && <BookmarksView />}
            {activeTab === 'profile' && <ProfileView />}
            {activeTab === 'user_profile' && (
              <ProfileView userId={selectedUserId || undefined} />
            )}
            {activeTab === 'admin' && <AdminDashboard />}
          </div>
        </main>

        {/* Right Sidebar (Desktop only) */}
        {activeTab !== 'messages' && <RightSidebar />}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenCreatePost={() => setCreatePostModalOpen(true)} />

      {/* Global AI Assistant Drawer/Modal */}
      <AIAssistantModal />

      {/* Floating AI Action Trigger */}
      <AIFloatingTrigger />

      {/* Global Toast Alerts */}
      <Toast />

      {/* Global Create Post Modal */}
      <Modal
        isOpen={createPostModalOpen}
        onClose={() => setCreatePostModalOpen(false)}
        title="Compose Post"
        description="Share architectural patterns, research benchmarks or thoughts"
        maxWidth="lg"
      >
        <PostComposer
          isModal
          onSuccess={() => setCreatePostModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

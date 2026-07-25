import React, { useState } from 'react';
import { UserRole, Manuscript, ReviewerProfile } from './types';
import { MOCK_MANUSCRIPTS, MOCK_REVIEWER_PROFILES } from './data/mockData';
import { Header } from './components/Header';
import { ConstitutionModal } from './components/ConstitutionModal';
import { ReaderView } from './components/ReaderView';
import { SubmissionWizard } from './components/SubmissionWizard';
import { ReviewerStudio } from './components/ReviewerStudio';
import { EditorialDashboard } from './components/EditorialDashboard';
import { DiscoveryHub } from './components/DiscoveryHub';

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('reader');
  const [currentTab, setCurrentTab] = useState<string>('discovery');
  const [manuscripts, setManuscripts] = useState<Manuscript[]>(MOCK_MANUSCRIPTS);
  const [reviewerProfiles, setReviewerProfiles] = useState<ReviewerProfile[]>(MOCK_REVIEWER_PROFILES);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript>(MOCK_MANUSCRIPTS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConstitutionOpen, setIsConstitutionOpen] = useState<boolean>(false);

  // Handle new manuscript submission from Author Wizard
  const handleManuscriptSubmitted = (newManuscript: Manuscript) => {
    setManuscripts([newManuscript, ...manuscripts]);
    setSelectedManuscript(newManuscript);
    setCurrentTab('reader');
    setActiveRole('reader');
  };

  // Handle new review submitted from Reviewer Studio
  const handleReviewSubmitted = (reviewData: any) => {
    setManuscripts(prev => prev.map(m => {
      if (m.id === reviewData.manuscriptId) {
        return {
          ...m,
          reviews: [...m.reviews, reviewData]
        };
      }
      return m;
    }));

    // Increment RRI score for reviewer profile
    setReviewerProfiles(prev => prev.map(p => {
      if (p.id === reviewData.reviewerId) {
        return {
          ...p,
          rriScore: Math.min(100, p.rriScore + 2),
          verifiedDOIsCompleted: p.verifiedDOIsCompleted + 1
        };
      }
      return p;
    }));
  };

  // Handle status update from Editorial Control
  const handleUpdateStatus = (manuscriptId: string, newStatus: any) => {
    setManuscripts(prev => prev.map(m => {
      if (m.id === manuscriptId) {
        return {
          ...m,
          status: newStatus
        };
      }
      return m;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950 flex flex-col antialiased">
      
      {/* App Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onOpenConstitution={() => setIsConstitutionOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container View Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'discovery' && (
          <DiscoveryHub
            manuscripts={manuscripts}
            onSelectManuscript={(m) => {
              setSelectedManuscript(m);
              setCurrentTab('reader');
            }}
            searchQuery={searchQuery}
          />
        )}

        {currentTab === 'reader' && selectedManuscript && (
          <ReaderView
            manuscript={selectedManuscript}
            reviewerProfiles={reviewerProfiles}
          />
        )}

        {currentTab === 'submit' && (
          <SubmissionWizard
            onManuscriptSubmitted={handleManuscriptSubmitted}
          />
        )}

        {currentTab === 'reviewer' && (
          <ReviewerStudio
            profile={reviewerProfiles[0]}
            manuscriptsNeedingReview={manuscripts.filter(m => m.status === 'under_review' || m.status === 'submitted')}
            onSubmitReview={handleReviewSubmitted}
          />
        )}

        {currentTab === 'editor' && (
          <EditorialDashboard
            manuscripts={manuscripts}
            reviewers={reviewerProfiles}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-200">Digital Evolution Journal Ecosystem</span>
            <p className="text-[11px] text-slate-500">The Future of Scholarly Publishing • Open Access, Transparent Peer Review, and Crossref DOIs.</p>
          </div>
          <button
            onClick={() => setIsConstitutionOpen(true)}
            className="text-sky-400 hover:underline font-mono text-[11px] cursor-pointer"
          >
            Read Platform Constitution & Strategy
          </button>
        </div>
      </footer>

      {/* Constitution Modal */}
      <ConstitutionModal
        isOpen={isConstitutionOpen}
        onClose={() => setIsConstitutionOpen(false)}
      />

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { UserRole, Manuscript, ReviewerProfile } from './types';
import { Header } from './components/Header';
import { ConstitutionModal } from './components/ConstitutionModal';
import { SupabaseAuthModal } from './components/SupabaseAuthModal';
import { ReaderView } from './components/ReaderView';
import { SubmissionWizard } from './components/SubmissionWizard';
import { ReviewerStudio } from './components/ReviewerStudio';
import { EditorialDashboard } from './components/EditorialDashboard';
import { DiscoveryHub } from './components/DiscoveryHub';
import { 
  fetchManuscriptsFromDb, 
  saveManuscriptToDb, 
  updateManuscriptStatusInDb, 
  saveReviewToDb,
  upvoteReviewInDb,
  getLocalManuscripts,
  saveLocalManuscripts,
  getLocalReviewerProfiles,
  saveLocalReviewerProfiles
} from './services/supabaseService';
import { isSupabaseConfigured, supabase } from './lib/supabase';

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('reader');
  const [currentTab, setCurrentTab] = useState<string>('discovery');
  
  // Persistent local state initializers
  const [manuscripts, setManuscripts] = useState<Manuscript[]>(() => getLocalManuscripts());
  const [reviewerProfiles, setReviewerProfiles] = useState<ReviewerProfile[]>(() => getLocalReviewerProfiles());
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript>(() => manuscripts[0]);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConstitutionOpen, setIsConstitutionOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // Sync selectedManuscript whenever manuscripts array updates
  useEffect(() => {
    saveLocalManuscripts(manuscripts);
    if (selectedManuscript) {
      const updatedMatch = manuscripts.find(m => m.id === selectedManuscript.id);
      if (updatedMatch) {
        setSelectedManuscript(updatedMatch);
      }
    }
  }, [manuscripts]);

  // Sync reviewer profiles with localStorage
  useEffect(() => {
    saveLocalReviewerProfiles(reviewerProfiles);
  }, [reviewerProfiles]);

  // Load from Supabase on mount & establish Realtime channel if active
  useEffect(() => {
    fetchManuscriptsFromDb().then(data => {
      if (data && data.length > 0) {
        setManuscripts(data);
      }
    });

    if (isSupabaseConfigured() && supabase) {
      const channel = supabase
        .channel('realtime-journal-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'manuscripts' },
          () => {
            fetchManuscriptsFromDb().then(data => {
              if (data && data.length > 0) {
                setManuscripts(data);
              }
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Handle new manuscript submission from Author Wizard
  const handleManuscriptSubmitted = (newManuscript: Manuscript) => {
    const updated = [newManuscript, ...manuscripts];
    setManuscripts(updated);
    setSelectedManuscript(newManuscript);
    setCurrentTab('reader');
    setActiveRole('reader');
    saveManuscriptToDb(newManuscript);
  };

  // Handle new review submitted from Reviewer Studio
  const handleReviewSubmitted = (reviewData: any) => {
    // 1. Update manuscript reviews
    setManuscripts(prev => prev.map(m => {
      if (m.id === reviewData.manuscriptId) {
        const existingReviews = m.reviews || [];
        return {
          ...m,
          reviews: [...existingReviews, reviewData]
        };
      }
      return m;
    }));

    saveReviewToDb(reviewData, reviewData.manuscriptId);

    // 2. Update reviewer profile history & RRI score
    setReviewerProfiles(prev => prev.map(p => {
      if (p.id === reviewData.reviewerId) {
        const newHistoryItem = {
          manuscriptTitle: selectedManuscript?.title || 'Evaluated Manuscript',
          journalName: 'Digital Evolution',
          completedDate: reviewData.submittedDate || new Date().toISOString().split('T')[0],
          reviewDoi: reviewData.reviewDoi,
          helpfulnessScore: 1,
          decisionRecommendation: reviewData.recommendation,
          publicSummary: reviewData.publicCitableSnippet || 'Peer review evaluation completed.'
        };

        return {
          ...p,
          rriScore: Math.min(100, p.rriScore + 2),
          totalReviewsCompleted: p.totalReviewsCompleted + 1,
          verifiedDOIsCompleted: p.verifiedDOIsCompleted + 1,
          reviewHistory: [newHistoryItem, ...p.reviewHistory]
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
          status: newStatus,
          publishedDate: (newStatus === 'accepted' || newStatus === 'published')
            ? (m.publishedDate || new Date().toISOString().split('T')[0])
            : m.publishedDate
        };
      }
      return m;
    }));

    updateManuscriptStatusInDb(manuscriptId, newStatus);
  };

  // Handle reviewer assignment from Editorial Control
  const handleAssignReviewer = (manuscriptId: string, reviewer: ReviewerProfile) => {
    setManuscripts(prev => prev.map(m => {
      if (m.id === manuscriptId) {
        const updatedStatus = m.status === 'submitted' ? 'under_review' : m.status;
        const currentAssigned = m.assignedReviewerIds || [];
        const updatedAssigned = currentAssigned.includes(reviewer.id)
          ? currentAssigned
          : [...currentAssigned, reviewer.id];
        return {
          ...m,
          status: updatedStatus,
          assignedReviewerIds: updatedAssigned
        };
      }
      return m;
    }));

    updateManuscriptStatusInDb(manuscriptId, 'under_review');
  };

  // Handle review helpful upvoting
  const handleUpvoteReview = (manuscriptId: string, reviewId: string) => {
    setManuscripts(prev => prev.map(m => {
      if (m.id === manuscriptId) {
        return {
          ...m,
          reviews: m.reviews.map(r => r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r)
        };
      }
      return m;
    }));

    upvoteReviewInDb(manuscriptId, reviewId);
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
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
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

        {currentTab === 'reader' && (
          <ReaderView
            manuscript={selectedManuscript}
            manuscriptId={selectedManuscript?.id}
            reviewerProfiles={reviewerProfiles}
            onUpvoteReview={(reviewId) => selectedManuscript && handleUpvoteReview(selectedManuscript.id, reviewId)}
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
            onAssignReviewer={handleAssignReviewer}
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

      {/* Supabase Auth & Config Modal */}
      <SupabaseAuthModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

    </div>
  );
}


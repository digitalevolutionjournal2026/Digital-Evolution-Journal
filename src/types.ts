export type UserRole = 'reader' | 'author' | 'reviewer' | 'editor';

export type ManuscriptStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'revision_requested' 
  | 'accepted' 
  | 'published' 
  | 'rejected';

export interface Author {
  id: string;
  name: string;
  affiliation: string;
  orcid?: string;
  email: string;
  isCorresponding?: boolean;
  avatarUrl?: string;
}

export interface ReviewerBadge {
  title: string;
  description: string;
  earnedDate: string;
  iconName: string;
}

export interface ReviewerProfile {
  id: string;
  name: string;
  title: string;
  institution: string;
  avatarUrl: string;
  orcid: string;
  rriScore: number; // Reviewer Reputation Index
  percentile: number;
  totalReviewsCompleted: number;
  verifiedDOIsCompleted: number;
  avgTurnaroundDays: number;
  upvotesCount: number;
  expertiseTags: string[];
  badges: ReviewerBadge[];
  reviewHistory: {
    manuscriptTitle: string;
    journalName: string;
    completedDate: string;
    reviewDoi: string;
    helpfulnessScore: number;
    decisionRecommendation: 'accept' | 'minor_revision' | 'major_revision' | 'reject';
    publicSummary: string;
  }[];
}

export interface ReviewScore {
  methodologyRigor: number; // 1-5
  originality: number; // 1-5
  dataAvailability: number; // 1-5
  clarity: number; // 1-5
  overallRating: number; // 1-5
}

export interface ManuscriptReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerInstitution: string;
  reviewerRri: number;
  submittedDate: string;
  recommendation: 'accept' | 'minor_revision' | 'major_revision' | 'reject';
  scores: ReviewScore;
  editorComments: string;
  authorComments: string;
  publicCitableSnippet?: string;
  reviewDoi?: string;
  helpfulVotes: number;
}

export interface Figure {
  id: string;
  caption: string;
  imageUrl: string;
  credit?: string;
}

export interface Reference {
  id: string;
  citationKey: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
}

export interface Manuscript {
  id: string;
  doi: string;
  title: string;
  subtitle?: string;
  abstract: string;
  aiExecutiveSummary: string;
  authors: Author[];
  discipline: string;
  keywords: string[];
  submittedDate: string;
  publishedDate?: string;
  status: ManuscriptStatus;
  formatSource: 'docx' | 'latex' | 'markdown';
  viewsCount: number;
  downloadsCount: number;
  citationsCount: number;
  pdfUrl: string;
  htmlContent: {
    introduction: string;
    methodology: string;
    results: string;
    discussion: string;
    conclusion: string;
  };
  figures: Figure[];
  references: Reference[];
  reviews: ManuscriptReview[];
  aiPreCheckScore?: {
    plagiarismIndex: number; // percentage
    referenceIntegrity: number; // 0-100
    methodologyCompleteness: number; // 0-100
    reproducibilityScore: number; // 0-100
    flaggedIssues: string[];
  };
  assignedReviewerIds?: string[];
}

export interface JournalSettings {
  name: string;
  tagline: string;
  reviewPolicy: 'single_blind' | 'double_blind' | 'open_review';
  defaultFormatRequirement: string;
  acceptsFormats: string[];
}

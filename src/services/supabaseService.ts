import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Manuscript, ReviewerProfile, ManuscriptReview, ManuscriptStatus } from '../types';
import { MOCK_MANUSCRIPTS, MOCK_REVIEWER_PROFILES } from '../data/mockData';

const LOCAL_STORAGE_KEY_MANUSCRIPTS = 'de_manuscripts_v1';
const LOCAL_STORAGE_KEY_REVIEWERS = 'de_reviewer_profiles_v1';

// Helper to get local stored manuscripts
export function getLocalManuscripts(): Manuscript[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_MANUSCRIPTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local manuscripts store', e);
  }
  return MOCK_MANUSCRIPTS;
}

// Helper to save local manuscripts
export function saveLocalManuscripts(manuscripts: Manuscript[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_MANUSCRIPTS, JSON.stringify(manuscripts));
  } catch (e) {
    console.warn('Failed to save to local storage', e);
  }
}

// Helper to get local reviewer profiles
export function getLocalReviewerProfiles(): ReviewerProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_REVIEWERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local reviewers store', e);
  }
  return MOCK_REVIEWER_PROFILES;
}

// Helper to save local reviewer profiles
export function saveLocalReviewerProfiles(profiles: ReviewerProfile[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_REVIEWERS, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Failed to save reviewer profiles to local storage', e);
  }
}

// Fetch manuscripts from Supabase or fallback to LocalStorage/MOCK
export async function fetchManuscriptsFromDb(): Promise<Manuscript[]> {
  const localData = getLocalManuscripts();

  if (!isSupabaseConfigured() || !supabase) {
    return localData;
  }

  try {
    const { data, error } = await supabase
      .from('manuscripts')
      .select(`*`)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return localData;
    }

    // Map database rows to Manuscript interface
    const remoteManuscripts: Manuscript[] = data.map((row: any) => ({
      id: row.id,
      doi: row.doi,
      title: row.title,
      subtitle: row.subtitle,
      abstract: row.abstract,
      aiExecutiveSummary: row.ai_executive_summary || '',
      authors: row.authors || [],
      discipline: row.discipline,
      keywords: row.keywords || [],
      submittedDate: row.submitted_date,
      publishedDate: row.published_date,
      status: row.status as ManuscriptStatus,
      formatSource: row.format_source || 'docx',
      viewsCount: row.views_count || 0,
      downloadsCount: row.downloads_count || 0,
      citationsCount: row.citations_count || 0,
      pdfUrl: row.pdf_url || '',
      htmlContent: {
        introduction: row.html_introduction || '',
        methodology: row.html_methodology || '',
        results: row.html_results || '',
        discussion: row.html_discussion || '',
        conclusion: row.html_conclusion || '',
      },
      figures: row.figures || [],
      references: row.references || [],
      reviews: row.reviews || [],
      aiPreCheckScore: row.ai_precheck_plagiarism !== undefined ? {
        plagiarismIndex: Number(row.ai_precheck_plagiarism || 0),
        referenceIntegrity: Number(row.ai_precheck_ref_integrity || 100),
        methodologyCompleteness: Number(row.ai_precheck_methodology || 100),
        reproducibilityScore: Number(row.ai_precheck_reproducibility || 100),
        flaggedIssues: []
      } : undefined
    }));

    // Merge remote with local items that might not be in DB yet
    const combined = [...remoteManuscripts];
    for (const localM of localData) {
      if (!combined.some(m => m.id === localM.id)) {
        combined.push(localM);
      }
    }
    saveLocalManuscripts(combined);
    return combined;
  } catch (err) {
    console.error('Error in fetchManuscriptsFromDb:', err);
    return localData;
  }
}

// Fetch a single full manuscript dynamically from Supabase or LocalStorage/MOCK fallback
export async function fetchSingleManuscriptFromDb(id: string): Promise<Manuscript | null> {
  const localData = getLocalManuscripts();
  const localMatch = localData.find(m => m.id === id);

  if (!isSupabaseConfigured() || !supabase) {
    return localMatch || null;
  }

  try {
    const { data, error } = await supabase
      .from('manuscripts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return localMatch || null;
    }

    const manuscript: Manuscript = {
      id: data.id,
      doi: data.doi,
      title: data.title,
      subtitle: data.subtitle,
      abstract: data.abstract,
      aiExecutiveSummary: data.ai_executive_summary || '',
      authors: data.authors || [],
      discipline: data.discipline,
      keywords: data.keywords || [],
      submittedDate: data.submitted_date,
      publishedDate: data.published_date,
      status: data.status as ManuscriptStatus,
      formatSource: data.format_source || 'docx',
      viewsCount: data.views_count || 0,
      downloadsCount: data.downloads_count || 0,
      citationsCount: data.citations_count || 0,
      pdfUrl: data.pdf_url || '',
      htmlContent: {
        introduction: data.html_introduction || '',
        methodology: data.html_methodology || '',
        results: data.html_results || '',
        discussion: data.html_discussion || '',
        conclusion: data.html_conclusion || '',
      },
      figures: data.figures || [],
      references: data.references || [],
      reviews: data.reviews || [],
      aiPreCheckScore: data.ai_precheck_plagiarism !== undefined ? {
        plagiarismIndex: Number(data.ai_precheck_plagiarism || 0),
        referenceIntegrity: Number(data.ai_precheck_ref_integrity || 100),
        methodologyCompleteness: Number(data.ai_precheck_methodology || 100),
        reproducibilityScore: Number(data.ai_precheck_reproducibility || 100),
        flaggedIssues: []
      } : undefined
    };

    return manuscript;
  } catch (err) {
    console.error('Error fetching single manuscript from DB:', err);
    return localMatch || null;
  }
}

// Save a newly submitted manuscript to Supabase & LocalStorage
export async function saveManuscriptToDb(manuscript: Manuscript): Promise<boolean> {
  const current = getLocalManuscripts();
  const updated = [manuscript, ...current.filter(m => m.id !== manuscript.id)];
  saveLocalManuscripts(updated);

  if (!isSupabaseConfigured() || !supabase) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('manuscripts')
      .insert([{
        id: manuscript.id,
        doi: manuscript.doi,
        title: manuscript.title,
        subtitle: manuscript.subtitle,
        abstract: manuscript.abstract,
        ai_executive_summary: manuscript.aiExecutiveSummary,
        discipline: manuscript.discipline,
        keywords: manuscript.keywords,
        authors: manuscript.authors,
        submitted_date: manuscript.submittedDate,
        status: manuscript.status,
        format_source: manuscript.formatSource,
        pdf_url: manuscript.pdfUrl,
        figures: manuscript.figures,
        references: manuscript.references,
        reviews: manuscript.reviews,
        html_introduction: manuscript.htmlContent.introduction,
        html_methodology: manuscript.htmlContent.methodology,
        html_results: manuscript.htmlContent.results,
        html_discussion: manuscript.htmlContent.discussion,
        html_conclusion: manuscript.htmlContent.conclusion,
        ai_precheck_plagiarism: manuscript.aiPreCheckScore?.plagiarismIndex ?? 2.1,
        ai_precheck_ref_integrity: manuscript.aiPreCheckScore?.referenceIntegrity ?? 98,
        ai_precheck_methodology: manuscript.aiPreCheckScore?.methodologyCompleteness ?? 94,
        ai_precheck_reproducibility: manuscript.aiPreCheckScore?.reproducibilityScore ?? 91,
      }]);

    if (error) {
      console.warn('Supabase saveManuscript warning:', error.message);
    }

    await logAuditEntry('SUBMIT_MANUSCRIPT', 'manuscript', manuscript.id, {
      title: manuscript.title,
      authorsCount: manuscript.authors.length
    });

    return true;
  } catch (err) {
    console.error('Error in saveManuscriptToDb:', err);
    return false;
  }
}

// Update manuscript status in Supabase & LocalStorage
export async function updateManuscriptStatusInDb(
  manuscriptId: string, 
  status: ManuscriptStatus,
  extraFields?: Partial<Manuscript>
): Promise<boolean> {
  const current = getLocalManuscripts();
  const updated = current.map(m => m.id === manuscriptId ? { ...m, status, ...extraFields } : m);
  saveLocalManuscripts(updated);

  if (!isSupabaseConfigured() || !supabase) {
    return true;
  }

  try {
    const updatePayload: Record<string, any> = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    if (extraFields?.publishedDate) {
      updatePayload.published_date = extraFields.publishedDate;
    }

    const { error } = await supabase
      .from('manuscripts')
      .update(updatePayload)
      .eq('id', manuscriptId);

    if (error) {
      console.warn('Supabase updateManuscriptStatus warning:', error.message);
    }

    await logAuditEntry('UPDATE_STATUS', 'manuscript', manuscriptId, { status, ...extraFields });
    return true;
  } catch (err) {
    console.error('Error updating manuscript status in DB:', err);
    return false;
  }
}

// Save a submitted peer review
export async function saveReviewToDb(review: ManuscriptReview, manuscriptId: string): Promise<boolean> {
  const current = getLocalManuscripts();
  const updated = current.map(m => {
    if (m.id === manuscriptId) {
      const existingReviews = m.reviews || [];
      return {
        ...m,
        reviews: [...existingReviews.filter(r => r.id !== review.id), review]
      };
    }
    return m;
  });
  saveLocalManuscripts(updated);

  if (!isSupabaseConfigured() || !supabase) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('reviews')
      .insert([{
        id: review.id,
        manuscript_id: manuscriptId,
        reviewer_id: review.reviewerId,
        reviewer_name: review.reviewerName,
        reviewer_institution: review.reviewerInstitution,
        reviewer_rri: review.reviewerRri,
        submitted_date: review.submittedDate,
        recommendation: review.recommendation,
        score_methodology: review.scores.methodologyRigor,
        score_originality: review.scores.originality,
        score_data_availability: review.scores.dataAvailability,
        score_clarity: review.scores.clarity,
        score_overall: review.scores.overallRating,
        editor_comments: review.editorComments,
        author_comments: review.authorComments,
        public_citable_snippet: review.publicCitableSnippet,
        review_doi: review.reviewDoi,
        helpful_votes: review.helpfulVotes
      }]);

    if (error) {
      console.warn('Supabase saveReview warning:', error.message);
    }

    await logAuditEntry('SUBMIT_REVIEW', 'review', review.id, {
      manuscriptId,
      reviewerId: review.reviewerId,
      recommendation: review.recommendation
    });

    return true;
  } catch (err) {
    console.error('Error in saveReviewToDb:', err);
    return false;
  }
}

// Upvote review in DB & LocalStorage
export async function upvoteReviewInDb(manuscriptId: string, reviewId: string): Promise<boolean> {
  const current = getLocalManuscripts();
  const updated = current.map(m => {
    if (m.id === manuscriptId) {
      return {
        ...m,
        reviews: m.reviews.map(r => r.id === reviewId ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r)
      };
    }
    return m;
  });
  saveLocalManuscripts(updated);

  await logAuditEntry('UPVOTE_REVIEW', 'review', reviewId, { manuscriptId });
  return true;
}

// Record system audit log
export async function logAuditEntry(
  action: string, 
  entityType: string, 
  entityId: string, 
  metadata: Record<string, any> = {}
): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    console.log(`[Audit Log] ${action} on ${entityType}:${entityId}`, metadata);
    return;
  }

  try {
    await supabase.from('audit_logs').insert([{
      actor_id: 'current-session-user',
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata
    }]);
  } catch (err) {
    console.warn('Failed to record audit log in Supabase:', err);
  }
}


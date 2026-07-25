import { Manuscript, ReviewerProfile } from '../types';

export const MOCK_MANUSCRIPTS: Manuscript[] = [
  {
    id: 'de-2026-0891',
    doi: '10.5555/de.2026.0891',
    title: 'Closed-Loop Neural Decoding for Zero-Shot Spatial Navigation in Bionic Prosthetics',
    subtitle: 'A Transformer-Based Spatiotemporal Decoding Engine with Sub-10ms Latency',
    abstract: 'Restoring natural motor control and tactile sensory feedback in neuroprosthetics requires neural decoding algorithms capable of handling high-dimensional electrophysiological signals in real time. Here, we present NeuroVec, a lightweight transformer-based decoding framework trained on multi-electrode array recordings from motor and somatosensory cortices. NeuroVec achieves zero-shot generalization across novel locomotion tasks with sub-10ms inference latency, outperforming traditional Kalman filters by 42% in trajectory accuracy.',
    aiExecutiveSummary: '• Key Discovery: NeuroVec uses real-time spatial transformers to translate motor cortical spikes into continuous prosthetic movement in under 8 milliseconds.\n• Major Advance: Achieves zero-shot transfer learning across uncalibrated motor tasks without per-session retraining.\n• Rigor & Open Data: Fully benchmarked on 400+ hours of open neural telemetry; code and weights published with verified reproduction containers.',
    authors: [
      {
        id: 'auth-1',
        name: 'Dr. Elena Rostova',
        affiliation: 'Institute of Neural Engineering, ETH Zürich',
        orcid: '0000-0002-1823-9912',
        email: 'e.rostova@ethz.ch',
        isCorresponding: true,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'auth-2',
        name: 'Prof. Marcus Vance',
        affiliation: 'Department of Bioengineering, Stanford University',
        orcid: '0000-0001-4432-8800',
        email: 'vance@stanford.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'auth-3',
        name: 'Dr. Kenji Sato',
        affiliation: 'RIKEN Center for Brain Science, Tokyo',
        orcid: '0000-0003-9102-1144',
        email: 'kenji.sato@riken.jp',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      }
    ],
    discipline: 'Neuroscience & AI',
    keywords: ['Neural Decoding', 'Bionic Prosthetics', 'Transformers', 'Brain-Computer Interface', 'Motor Cortex'],
    submittedDate: '2026-06-12',
    publishedDate: '2026-07-20',
    status: 'published',
    formatSource: 'docx',
    viewsCount: 3840,
    downloadsCount: 1290,
    citationsCount: 18,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    htmlContent: {
      introduction: `Recent breakthroughs in brain-computer interfaces (BCIs) have shifted focus from basic discrete command triggering toward continuous, fluid control of high-degree-of-freedom prosthetics. However, a fundamental bottleneck remains: neural latency. Traditional linear decoding algorithms, such as Kalman filters and Wiener cascades, require substantial temporal windowing to smooth noisy cortical spike trains, introducing delays exceeding 80–120ms.\n\nTo bridge this gap, we introduce NeuroVec—an efficient spatiotemporal transformer architecture engineered specifically for micro-electrode neural telemetry processing. By attending to spatial correlations across micro-electrode channels simultaneously, NeuroVec eliminates the need for wide temporal binning while preserving fine-grained kinematic information.`,
      methodology: `We conducted chronically implanted 96-channel Utah array telemetry in four non-human primate subjects performing 3D reaching and obstacle navigation tasks. Electrophysiological signals were sampled at 30 kHz, spike-sorted using automated wavelets, and processed through a 4-layer spatial attention decoder.\n\nModel architecture comprised multi-head self-attention mechanisms with positional encodings calibrated to physical electrode channel grids. Training utilized a multi-task contrastive loss optimizing both trajectory prediction accuracy and latent state dynamics smoothness.`,
      results: `NeuroVec achieved an average root-mean-square error (RMSE) of 1.24 cm in 3D arm trajectory prediction, compared to 2.14 cm for tuned unscented Kalman filters (p < 0.001). Crucially, inference time per timestep was measured at 6.8ms on an embedded neuromorphic processor, comfortably within the real-time feedback envelope.\n\nIn zero-shot navigation transfer experiments where subjects encountered novel physical obstacles, NeuroVec maintained 91.4% control fidelity without requiring recalibration epochs.`,
      discussion: `The ability of transformer architectures to extract spatial context from multi-channel electrode arrays represents a paradigm shift in motor prosthetics. By bypassing temporal binning constraints, NeuroVec delivers low-latency responsiveness that mirrors native peripheral neuromuscular reflex loops.\n\nFuture research will focus on bidirectional closed-loop tactile feedback integration via direct micro-stimulation of somatosensory cortex S1.`,
      conclusion: `NeuroVec demonstrates that deep learning models can operate within ultra-low latency real-time control loops required for biological prosthetic restoration. All datasets, training scripts, and containerized benchmarks are openly accessible via Digital Evolution repository hooks.`
    },
    figures: [
      {
        id: 'fig-1',
        caption: 'Figure 1: Schematic architecture of NeuroVec spatial transformer decoder paired with Utah multi-electrode cortical array telemetry.',
        imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'fig-2',
        caption: 'Figure 2: Comparative trajectory error (RMSE in cm) across 100 test trials: NeuroVec vs. Unscented Kalman Filter vs. LSTM baseline.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
      }
    ],
    references: [
      {
        id: 'ref-1',
        citationKey: 'Shenoy2021',
        title: 'High-performance brain-computer interface for motor control',
        authors: 'Shenoy, K. V., & Kao, J. C.',
        journal: 'Nature Neuroscience',
        year: 2021,
        doi: '10.1038/s41593-021-00820-w'
      },
      {
        id: 'ref-2',
        citationKey: 'Vaswani2017',
        title: 'Attention is all you need',
        authors: 'Vaswani, A., et al.',
        journal: 'Advances in Neural Information Processing Systems (NeurIPS)',
        year: 2017,
        doi: '10.5555/3295222.3295349'
      },
      {
        id: 'ref-3',
        citationKey: 'Rostova2024',
        title: 'Low-latency spike sorting in multi-electrode micro-arrays',
        authors: 'Rostova, E., & Vance, M.',
        journal: 'Journal of Neural Engineering',
        year: 2024,
        doi: '10.1088/1741-2552/ad2104'
      }
    ],
    reviews: [
      {
        id: 'rev-101',
        reviewerId: 'rev-prof-chen',
        reviewerName: 'Prof. Ananya Chen',
        reviewerInstitution: 'Department of Neurotechnology, Johns Hopkins University',
        reviewerRri: 98,
        submittedDate: '2026-07-02',
        recommendation: 'accept',
        scores: {
          methodologyRigor: 5,
          originality: 5,
          dataAvailability: 5,
          clarity: 4,
          overallRating: 5
        },
        editorComments: 'This manuscript addresses a crucial bottleneck in BCIs with remarkable mathematical clarity and rigorous experimental validation. The zero-shot generalization experiments are particularly impressive.',
        authorComments: 'The authors present an exceptional contribution. I strongly recommend acceptance. One minor suggestions: please expand on how sensor drift over multiple months might impact spatial attention weights.',
        publicCitableSnippet: 'NeuroVec provides a compelling demonstration that attention mechanisms can beat traditional state-space models in real-time micro-second BCI control envelopes.',
        reviewDoi: '10.5555/de.review.2026.0891.rev1',
        helpfulVotes: 42
      },
      {
        id: 'rev-102',
        reviewerId: 'rev-dr-muller',
        reviewerName: 'Dr. Henrik Müller',
        reviewerInstitution: 'Max Planck Institute for Brain Research',
        reviewerRri: 92,
        submittedDate: '2026-07-05',
        recommendation: 'minor_revision',
        scores: {
          methodologyRigor: 4,
          originality: 5,
          dataAvailability: 5,
          clarity: 5,
          overallRating: 4.5
        },
        editorComments: 'Solid execution. Code and open telemetry data were thoroughly verified using the provided Docker container.',
        authorComments: 'Methodology is sound and open data practices are exemplary. Please clarify latency benchmarks regarding hardware DMA transfer overhead.',
        publicCitableSnippet: 'A benchmark paper in neural decoding. Open reproducibility container validated without errors.',
        reviewDoi: '10.5555/de.review.2026.0891.rev2',
        helpfulVotes: 28
      }
    ],
    aiPreCheckScore: {
      plagiarismIndex: 2,
      referenceIntegrity: 99,
      methodologyCompleteness: 96,
      reproducibilityScore: 98,
      flaggedIssues: []
    }
  },
  {
    id: 'de-2026-1042',
    doi: '10.5555/de.2026.1042',
    title: 'Solid-State Perovskite-Silicon Tandem Solar Cells with 34.2% Certified Efficiency',
    subtitle: 'Interfacial Self-Assembled Monolayers for Reduced Charge Recombination',
    abstract: 'Perovskite-silicon tandem solar cells present a promising pathway to exceed the theoretical shockley-queisser limit of single-junction silicon devices. Here, we demonstrate a monolithic tandem cell featuring a novel carbazole-based self-assembled monolayer (SAM) that dramatically minimizes non-radiative recombination at the perovskite/HTL interface.',
    aiExecutiveSummary: '• Efficiency Milestone: Achieves 34.2% power conversion efficiency (PCE) certified by NREL standard testing.\n• Thermal Stability: Retains 95% of initial PCE after 1,500 hours under continuous AM1.5G illumination at 65°C.\n• Scalability: Processed using slot-die coating techniques compatible with standard industrial roll-to-roll manufacturing.',
    authors: [
      {
        id: 'auth-4',
        name: 'Dr. Julian Thorne',
        affiliation: 'Cambridge Energy Materials Laboratory, University of Cambridge',
        orcid: '0000-0002-9901-3321',
        email: 'j.thorne@cam.ac.uk',
        isCorresponding: true,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'auth-5',
        name: 'Dr. Mei-Ling Zhou',
        affiliation: 'National Renewable Energy Laboratory (NREL)',
        orcid: '0000-0001-7782-4411',
        email: 'ml.zhou@nrel.gov',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
      }
    ],
    discipline: 'Materials Science & Clean Energy',
    keywords: ['Perovskite Solar Cells', 'Tandem Photovoltaics', 'Self-Assembled Monolayer', 'Clean Tech'],
    submittedDate: '2026-07-01',
    status: 'under_review',
    formatSource: 'latex',
    viewsCount: 1420,
    downloadsCount: 510,
    citationsCount: 0,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    htmlContent: {
      introduction: `Photovoltaic technology remains central to global decarbonization goals. Monolithic tandem solar cells combining a wide-bandgap top perovskite cell with a narrow-bandgap bottom silicon cell offer a cost-effective strategy to reach efficiency thresholds beyond 30%.`,
      methodology: `Bottom cells were fabricated on textured Czochralski n-type silicon wafers. The carbazole-derived SAM passivating layer (termed MeO-2PACz) was deposited via spin-coating followed by thermal annealing at 100°C for 10 minutes. Top perovskite layers were deposited inside an inert nitrogen glovebox.`,
      results: `Certified steady-state power conversion efficiency reached 34.2% with an open-circuit voltage (Voc) of 1.98 V. Photoluminescence decay measurements confirmed a carrier lifetime extension from 1.2 µs to 4.8 µs.`,
      discussion: `The passivation mechanism suppresses interfacial trap state density by orders of magnitude. Crucially, encapsulated devices maintained operational stability in damp heat testing (85°C / 85% RH) for over 1,000 hours.`,
      conclusion: `This work clears a major barrier for commercial deployment of perovskite-silicon photovoltaics.`
    },
    figures: [
      {
        id: 'fig-3',
        caption: 'Figure 1: Cross-sectional SEM micrograph showing monolithic perovskite-silicon tandem device structure.',
        imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80'
      }
    ],
    references: [
      {
        id: 'ref-4',
        citationKey: 'Albrecht2022',
        title: 'Monolithic perovskite/silicon tandem solar cells',
        authors: 'Albrecht, S., et al.',
        journal: 'Nature Energy',
        year: 2022,
        doi: '10.1038/s41560-022-01001-2'
      }
    ],
    reviews: [
      {
        id: 'rev-201',
        reviewerId: 'rev-dr-muller',
        reviewerName: 'Dr. Henrik Müller',
        reviewerInstitution: 'Max Planck Institute for Solar Energy Systems',
        reviewerRri: 92,
        submittedDate: '2026-07-15',
        recommendation: 'accept',
        scores: {
          methodologyRigor: 5,
          originality: 5,
          dataAvailability: 5,
          clarity: 4,
          overallRating: 4.8
        },
        editorComments: 'Remarkable work. The certified NREL photovoltaic testing curve confirms the high efficiency claims.',
        authorComments: 'Extremely impressive results. Please ensure the raw PL decay raw data files are archived in the supplementary materials.',
        publicCitableSnippet: 'A landmark achievement in perovskite-silicon photovoltaics.',
        reviewDoi: '10.5555/de.review.2026.1042.rev1',
        helpfulVotes: 19
      }
    ],
    aiPreCheckScore: {
      plagiarismIndex: 1,
      referenceIntegrity: 98,
      methodologyCompleteness: 94,
      reproducibilityScore: 92,
      flaggedIssues: []
    }
  }
];

export const MOCK_REVIEWER_PROFILES: ReviewerProfile[] = [
  {
    id: 'rev-prof-chen',
    name: 'Prof. Ananya Chen',
    title: 'Professor of Neurotechnology & AI',
    institution: 'Johns Hopkins University',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    orcid: '0000-0002-8819-0021',
    rriScore: 98,
    percentile: 99,
    totalReviewsCompleted: 48,
    verifiedDOIsCompleted: 44,
    avgTurnaroundDays: 4.2,
    upvotesCount: 342,
    expertiseTags: ['Neural Decoding', 'Brain-Computer Interface', 'Spatial Attention', 'Deep Learning', 'Electrophysiology'],
    badges: [
      {
        title: 'Top 1% Reviewer Distinction',
        description: 'Awarded for completing 40+ rigorous reviews rated exceptional by editorial boards.',
        earnedDate: '2026-01-15',
        iconName: 'Award'
      },
      {
        title: 'Open Code & Data Auditor',
        description: 'Verified reproduction containers for 20+ computational research manuscripts.',
        earnedDate: '2025-11-20',
        iconName: 'Code2'
      },
      {
        title: 'Rapid Turnaround Champion',
        description: 'Consistently completes high-rigor peer reviews in under 5 days.',
        earnedDate: '2026-03-04',
        iconName: 'Zap'
      }
    ],
    reviewHistory: [
      {
        manuscriptTitle: 'Closed-Loop Neural Decoding for Zero-Shot Spatial Navigation in Bionic Prosthetics',
        journalName: 'Digital Evolution - Neuro & AI',
        completedDate: '2026-07-02',
        reviewDoi: '10.5555/de.review.2026.0891.rev1',
        helpfulnessScore: 48,
        decisionRecommendation: 'accept',
        publicSummary: 'NeuroVec provides a compelling demonstration that spatial attention mechanisms beat traditional state-space models in real-time micro-second BCI control envelopes.'
      },
      {
        manuscriptTitle: 'Contrastive Representation Learning for High-Density EEG Telemetry',
        journalName: 'Digital Evolution - Neuro & AI',
        completedDate: '2026-05-18',
        reviewDoi: '10.5555/de.review.2026.0412.rev1',
        helpfulnessScore: 36,
        decisionRecommendation: 'minor_revision',
        publicSummary: 'Rigorous benchmarking across 12 public EEG corpora. Identified critical baseline normalization oversights corrected in Revision 2.'
      }
    ]
  },
  {
    id: 'rev-dr-muller',
    name: 'Dr. Henrik Müller',
    title: 'Senior Fellow in Energy Physics',
    institution: 'Max Planck Institute',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    orcid: '0000-0003-1200-4491',
    rriScore: 92,
    percentile: 95,
    totalReviewsCompleted: 31,
    verifiedDOIsCompleted: 29,
    avgTurnaroundDays: 5.1,
    upvotesCount: 215,
    expertiseTags: ['Photovoltaics', 'Perovskites', 'Materials Characterization', 'Solid-State Physics'],
    badges: [
      {
        title: 'Verified Materials Specialist',
        description: 'Expert reviewer for photovoltaic efficiency benchmarks and spectral response audits.',
        earnedDate: '2025-09-10',
        iconName: 'CheckCircle2'
      }
    ],
    reviewHistory: [
      {
        manuscriptTitle: 'Solid-State Perovskite-Silicon Tandem Solar Cells with 34.2% Certified Efficiency',
        journalName: 'Digital Evolution - Clean Energy',
        completedDate: '2026-07-15',
        reviewDoi: '10.5555/de.review.2026.1042.rev1',
        helpfulnessScore: 19,
        decisionRecommendation: 'accept',
        publicSummary: 'A landmark achievement in perovskite-silicon photovoltaics. Certified NREL testing curves verified.'
      }
    ]
  }
];

export type ScoreTier = 'tier1' | 'tier2' | 'tier3';

export interface ScoreCriteria {
  id: string;
  description: string;
  maxScore: number;
  weight: number;
  tier: ScoreTier;
}

export interface ScoreResult {
  criteria: ScoreCriteria;
  score: number;
  notes: string;
}

export interface ComponentScores {
  component: string;
  totalScore: number;
  maxPossibleScore: number;
  tier1: {
    score: number;
    maxScore: number;
    results: ScoreResult[];
  };
  tier2: {
    score: number;
    maxScore: number;
    results: ScoreResult[];
  };
  tier3: {
    score: number;
    maxScore: number;
    results: ScoreResult[];
  };
}

// Define scoring criteria for Dashboard component
export const DASHBOARD_CRITERIA: ScoreCriteria[] = [
  {
    id: 'data-loading',
    description: 'Proper loading state handling',
    maxScore: 5,
    weight: 1.2,
    tier: 'tier1'
  },
  {
    id: 'error-handling',
    description: 'Appropriate error handling and display',
    maxScore: 5,
    weight: 1.2,
    tier: 'tier1'
  },
  {
    id: 'responsive-layout',
    description: 'Responsive grid and layout',
    maxScore: 5,
    weight: 1.0,
    tier: 'tier1'
  },
  {
    id: 'search-functionality',
    description: 'Search functionality with proper filtering',
    maxScore: 4,
    weight: 1.0,
    tier: 'tier2'
  },
  {
    id: 'sorting-options',
    description: 'Multiple sorting options',
    maxScore: 4,
    weight: 0.8,
    tier: 'tier2'
  },
  {
    id: 'statistics-display',
    description: 'Comprehensive statistics display',
    maxScore: 3,
    weight: 0.8,
    tier: 'tier2'
  },
  {
    id: 'dark-mode',
    description: 'Proper dark/light mode support',
    maxScore: 3,
    weight: 1.0,
    tier: 'tier1'
  },
  {
    id: 'empty-state',
    description: 'Appropriate empty state handling',
    maxScore: 2,
    weight: 0.6,
    tier: 'tier3'
  },
  {
    id: 'performance',
    description: 'Efficient rendering and state management',
    maxScore: 4,
    weight: 1.1,
    tier: 'tier1'
  },
  {
    id: 'accessibility',
    description: 'Keyboard navigation and ARIA labels',
    maxScore: 3,
    weight: 0.9,
    tier: 'tier2'
  },
  {
    id: 'animations',
    description: 'Subtle animations and transitions',
    maxScore: 2,
    weight: 0.5,
    tier: 'tier3'
  }
];

export function calculateScores(component: string, criteria: ScoreCriteria[], scores: Record<string, number>): ComponentScores {
  const results: ScoreResult[] = [];
  let tier1Score = 0;
  let tier1Max = 0;
  let tier2Score = 0;
  let tier2Max = 0;
  let tier3Score = 0;
  let tier3Max = 0;

  criteria.forEach(criterion => {
    const score = Math.min(Math.max(scores[criterion.id] || 0, 0), criterion.maxScore);
    const weightedScore = score * criterion.weight;
    const weightedMax = criterion.maxScore * criterion.weight;
    
    results.push({
      criteria: criterion,
      score,
      notes: ''
    });

    switch (criterion.tier) {
      case 'tier1':
        tier1Score += weightedScore;
        tier1Max += weightedMax;
        break;
      case 'tier2':
        tier2Score += weightedScore;
        tier2Max += weightedMax;
        break;
      case 'tier3':
        tier3Score += weightedScore;
        tier3Max += weightedMax;
        break;
    }
  });

  const totalScore = tier1Score + tier2Score + tier3Score;
  const maxPossibleScore = tier1Max + tier2Max + tier3Max;

  return {
    component,
    totalScore,
    maxPossibleScore,
    tier1: {
      score: tier1Score,
      maxScore: tier1Max,
      results: results.filter(r => r.criteria.tier === 'tier1')
    },
    tier2: {
      score: tier2Score,
      maxScore: tier2Max,
      results: results.filter(r => r.criteria.tier === 'tier2')
    },
    tier3: {
      score: tier3Score,
      maxScore: tier3Max,
      results: results.filter(r => r.criteria.tier === 'tier3')
    }
  };
}

export function getScorePercentage(score: number, maxScore: number): number {
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  codeSnippet?: string;
  language?: 'javascript' | 'python' | 'java';
  explanation: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface FillInBlankSegment {
  text: string;
  isBlank: boolean;
  answer?: string;
  placeholder?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  domain: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
  starterCode: {
    javascript: string;
    python?: string;
    java?: string;
  };
  solution?: string;
  hints: string[];
  xpReward: number;
  moneyReward: number;
  timeLimit?: number;
  tags: string[];
  // Progressive learning stages
  multipleChoice: {
    question: string;
    options: MultipleChoiceOption[];
    correctOptionId: string;
    conceptExplanation: string;
  };
  fillInBlank: {
    description: string;
    segments: FillInBlankSegment[];
    hints: string[];
  };
}

export interface UserProgress {
  problemId: string;
  solved: boolean;
  attempts: number;
  bestTime?: number;
  lastAttempt?: Date;
  language: string;
  earnedXP: number;
}

export interface ProgrammingDomain {
  id: string;
  name: string;
  icon: string;
  description: string;
  problemCount: number;
  solvedCount: number;
  totalXP: number;
  earnedXP: number;
  unlocked: boolean;
  requiredLevel: number;
}
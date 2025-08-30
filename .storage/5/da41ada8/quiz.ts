export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswer: string; // A, B, C, or D
  explanation: string;
  order: number;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  lessonId?: string;
  createdBy: string;
  createdAt: Date;
  status: 'draft' | 'published' | 'archived';
  questionCount: number;
  estimatedTime: number; // minutes
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, string>; // questionId -> answer
  score: number; // percentage
  completedAt: Date;
  timeSpent: number; // seconds
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: Record<string, string>;
  explanations: Record<string, string>;
  timeSpent: number;
}

export interface GenerateQuizRequest {
  lessonContent: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  questionCount?: number;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface GenerateQuizResponse {
  questions: GeneratedQuestion[];
}
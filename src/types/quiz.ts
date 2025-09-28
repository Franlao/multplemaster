export type QuestionMode = "sequential" | "random";
export type TableMode = "specific" | "multiple" | "random";
export type SessionStatus = "selecting" | "active" | "completed";

export interface Question {
  id: string;
  table: number;
  multiplier: number;
  correctAnswer: number;
  userAnswer?: number;
  attempts: number;
  isCorrect?: boolean;
  timeAsked: Date;
}

export interface QuizSettings {
  tableMode: TableMode;
  selectedTable?: number;
  selectedTables?: number[];
  questionMode: QuestionMode;
  questionCount: number;
}

export interface QuizSession {
  id: string;
  settings: QuizSettings;
  questions: Question[];
  currentQuestionIndex: number;
  correctAnswers: number;
  totalQuestions: number;
  failedQuestions: Question[];
  isRetryPhase: boolean;
  status: SessionStatus;
  startTime: Date;
  endTime?: Date;
}

export interface QuizStats {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  averageAccuracy: number;
  tableStats: Record<
    number,
    {
      attempts: number;
      correct: number;
      accuracy: number;
    }
  >;
  lastPlayed: Date;
}

export interface PersistedData {
  stats: QuizStats;
  currentSession?: QuizSession;
}

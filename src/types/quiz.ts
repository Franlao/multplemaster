export type QuestionMode = "sequential" | "random";
export type TableMode = "specific" | "multiple" | "random";
export type SessionStatus = "selecting" | "active" | "completed";
export type Operation = "addition" | "subtraction" | "multiplication";

export interface Question {
  id: string;
  operation: Operation;
  firstNumber: number;
  secondNumber: number;
  correctAnswer: number;
  userAnswer?: number;
  attempts: number;
  isCorrect?: boolean;
  timeAsked: Date;
  // Legacy fields for backward compatibility
  table?: number;
  multiplier?: number;
}

export interface AdvancedSettings {
  tableSelectionMode: "range" | "specific";
  tableRangeMin: number;
  tableRangeMax: number;
  specificTables: number[];
  multiplierMin: number;
  multiplierMax: number;
}

export interface QuizSettings {
  operation: Operation;
  tableMode: TableMode;
  selectedTable?: number;
  selectedTables?: number[];
  questionMode: QuestionMode;
  questionCount: number;
  advancedSettings?: AdvancedSettings;
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

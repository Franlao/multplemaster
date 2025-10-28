import { useCallback, useEffect, useReducer } from "react";
import type {
  PersistedData,
  Question,
  QuizSession,
  QuizSettings,
  QuizStats,
} from "../types/quiz";
import {
  createSession,
  getCurrentQuestion,
  getSessionProgress,
  moveToNextQuestion,
  processAnswer,
} from "../utils/sessionManager";
import useLocalStorage from "./useLocalStorage";

type QuizAction =
  | { type: "START_SESSION"; settings: QuizSettings }
  | { type: "SUBMIT_ANSWER"; answer: number }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET_SESSION" }
  | { type: "LOAD_SESSION"; session: QuizSession }
  | { type: "START_REVIEW_SESSION"; questions: Question[] };

interface QuizState {
  session: QuizSession | null;
  currentQuestion: Question | null;
  progress: { current: number; total: number; percentage: number };
  isComplete: boolean;
}

const initialState: QuizState = {
  session: null,
  currentQuestion: null,
  progress: { current: 0, total: 0, percentage: 0 },
  isComplete: false,
};

const initialStats: QuizStats = {
  totalSessions: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  averageAccuracy: 0,
  tableStats: {},
  lastPlayed: new Date(),
};

const initialPersistedData: PersistedData = {
  stats: initialStats,
  currentSession: undefined,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START_SESSION": {
      const newSession = createSession(action.settings);
      const currentQuestion = getCurrentQuestion(newSession);
      const progress = getSessionProgress(newSession);

      return {
        ...state,
        session: newSession,
        currentQuestion,
        progress,
        isComplete: false,
      };
    }

    case "SUBMIT_ANSWER": {
      if (!state.session) return state;

      const updatedSession = processAnswer(state.session, action.answer);
      const currentQuestion = getCurrentQuestion(updatedSession);
      const progress = getSessionProgress(updatedSession);

      return {
        ...state,
        session: updatedSession,
        currentQuestion,
        progress,
      };
    }

    case "NEXT_QUESTION": {
      if (!state.session) return state;

      const updatedSession = moveToNextQuestion(state.session);
      const currentQuestion = getCurrentQuestion(updatedSession);
      const progress = getSessionProgress(updatedSession);
      const isComplete = updatedSession.status === "completed";

      return {
        ...state,
        session: updatedSession,
        currentQuestion,
        progress,
        isComplete,
      };
    }

    case "LOAD_SESSION": {
      const currentQuestion = getCurrentQuestion(action.session);
      const progress = getSessionProgress(action.session);
      const isComplete = action.session.status === "completed";

      return {
        ...state,
        session: action.session,
        currentQuestion,
        progress,
        isComplete,
      };
    }

    case "START_REVIEW_SESSION": {
      const reviewSession: QuizSession = {
        id: `review-session-${Date.now()}`,
        settings: {
          operation: action.questions[0]?.operation || "multiplication",
          tableMode: "specific",
          selectedTable: undefined,
          questionMode: "sequential",
          questionCount: action.questions.length,
        },
        questions: action.questions.map((q, index) => ({
          ...q,
          id: `review-${q.id}-${Date.now()}`,
          userAnswer: undefined,
          isCorrect: undefined,
          attempts: 0,
          timeAsked: new Date(),
        })),
        currentQuestionIndex: 0,
        correctAnswers: 0,
        totalQuestions: action.questions.length,
        failedQuestions: [],
        isRetryPhase: true,
        status: "active",
        startTime: new Date(),
      };

      const currentQuestion = getCurrentQuestion(reviewSession);
      const progress = getSessionProgress(reviewSession);

      return {
        ...state,
        session: reviewSession,
        currentQuestion,
        progress,
        isComplete: false,
      };
    }

    case "RESET_SESSION": {
      return initialState;
    }

    default:
      return state;
  }
}

export default function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [persistedData, setPersistedData] = useLocalStorage<PersistedData>(
    "ultrathink-quiz-data",
    initialPersistedData,
  );

  const updateStats = useCallback(
    (session: QuizSession) => {
      setPersistedData((prev) => {
        const newStats = { ...prev.stats };

        // Update overall stats
        newStats.totalSessions += 1;
        newStats.totalQuestions += session.totalQuestions;
        newStats.totalCorrect += session.correctAnswers;
        newStats.averageAccuracy =
          (newStats.totalCorrect / newStats.totalQuestions) * 100;
        newStats.lastPlayed = new Date();

        // Update table-specific stats
        session.questions.forEach((question) => {
          const numberKey = question.firstNumber;
          if (!newStats.tableStats[numberKey]) {
            newStats.tableStats[numberKey] = {
              attempts: 0,
              correct: 0,
              accuracy: 0,
            };
          }

          const tableStats = newStats.tableStats[numberKey];
          tableStats.attempts += 1;
          if (question.isCorrect) {
            tableStats.correct += 1;
          }
          tableStats.accuracy =
            (tableStats.correct / tableStats.attempts) * 100;
        });

        return {
          ...prev,
          stats: newStats,
        };
      });
    },
    [setPersistedData],
  );

  // Load session on mount if exists
  useEffect(() => {
    if (persistedData.currentSession && !state.session) {
      dispatch({ type: "LOAD_SESSION", session: persistedData.currentSession });
    }
  }, [persistedData.currentSession, state.session]);

  // Save session to localStorage when it changes
  useEffect(() => {
    if (state.session) {
      setPersistedData((prev) => ({
        ...prev,
        currentSession: state.session as QuizSession,
      }));
    }
  }, [state.session, setPersistedData]);

  // Update stats when session completes
  useEffect(() => {
    if (state.isComplete && state.session) {
      updateStats(state.session);
      // Clear current session
      setPersistedData((prev) => ({
        ...prev,
        currentSession: undefined,
      }));
    }
  }, [state.isComplete, state.session, updateStats, setPersistedData]);

  const startSession = useCallback((settings: QuizSettings) => {
    dispatch({ type: "START_SESSION", settings });
  }, []);

  const startReviewSession = useCallback((questions: Question[]) => {
    dispatch({ type: "START_REVIEW_SESSION", questions });
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    dispatch({ type: "SUBMIT_ANSWER", answer });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: "NEXT_QUESTION" });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: "RESET_SESSION" });
    setPersistedData((prev) => ({
      ...prev,
      currentSession: undefined,
    }));
  }, [setPersistedData]);

  return {
    // State
    session: state.session,
    currentQuestion: state.currentQuestion,
    progress: state.progress,
    isComplete: state.isComplete,
    stats: persistedData.stats,

    // Actions
    startSession,
    startReviewSession,
    submitAnswer,
    nextQuestion,
    resetSession,

    // Computed properties
    hasSession: !!state.session,
    isRetryPhase: state.session?.isRetryPhase ?? false,
    canAnswer: !!state.currentQuestion && !state.isComplete,
  };
}

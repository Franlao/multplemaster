import type { QuizSession, QuizSettings, Question } from "../types/quiz";
import { generateQuestions, createRetryQuestions } from "./questionGenerator";

export function createSession(settings: QuizSettings): QuizSession {
  const questions = generateQuestions(settings);

  return {
    id: `session-${Date.now()}`,
    settings,
    questions,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    totalQuestions: questions.length,
    failedQuestions: [],
    isRetryPhase: false,
    status: "active",
    startTime: new Date(),
  };
}

export function processAnswer(
  session: QuizSession,
  userAnswer: number,
): QuizSession {
  const currentQuestion = session.questions[session.currentQuestionIndex];
  const isCorrect = userAnswer === currentQuestion.correctAnswer;

  // Update current question
  const updatedQuestion: Question = {
    ...currentQuestion,
    userAnswer,
    attempts: currentQuestion.attempts + 1,
    isCorrect,
  };

  const updatedQuestions = [...session.questions];
  updatedQuestions[session.currentQuestionIndex] = updatedQuestion;

  // Track failed questions for retry
  const updatedFailedQuestions = [...session.failedQuestions];
  if (!isCorrect && !session.isRetryPhase) {
    // Only add to failed questions if it's not already a retry
    updatedFailedQuestions.push(updatedQuestion);
  }

  // Update session stats
  const correctAnswers = isCorrect
    ? session.correctAnswers + 1
    : session.correctAnswers;

  return {
    ...session,
    questions: updatedQuestions,
    correctAnswers,
    failedQuestions: updatedFailedQuestions,
  };
}

export function moveToNextQuestion(session: QuizSession): QuizSession {
  const nextIndex = session.currentQuestionIndex + 1;

  // Check if we've completed all questions
  if (nextIndex >= session.questions.length) {
    // If we have failed questions and haven't done retry phase, start retry
    if (session.failedQuestions.length > 0 && !session.isRetryPhase) {
      const retryQuestions = createRetryQuestions(session.failedQuestions);
      return {
        ...session,
        questions: retryQuestions,
        currentQuestionIndex: 0,
        failedQuestions: [],
        isRetryPhase: true,
        totalQuestions: session.totalQuestions + retryQuestions.length,
      };
    } else {
      // Session completed
      return {
        ...session,
        status: "completed",
        endTime: new Date(),
      };
    }
  }

  return {
    ...session,
    currentQuestionIndex: nextIndex,
  };
}

export function getCurrentQuestion(session: QuizSession): Question | null {
  if (session.currentQuestionIndex >= session.questions.length) {
    return null;
  }
  return session.questions[session.currentQuestionIndex];
}

export function getSessionProgress(session: QuizSession): {
  current: number;
  total: number;
  percentage: number;
} {
  const current = session.currentQuestionIndex + 1;
  const total = session.questions.length;
  const percentage = Math.round((current / total) * 100);

  return { current, total, percentage };
}

"use client";

import { useQuiz } from "../hooks";
import { QuizSelection, QuizGame, QuizResults } from "../components";

export default function Home() {
  const {
    session,
    currentQuestion,
    progress,
    isComplete,
    stats,
    startSession,
    startReviewSession,
    submitAnswer,
    nextQuestion,
    resetSession,
    hasSession,
    isRetryPhase,
    canAnswer,
  } = useQuiz();

  // Show results if session is complete
  if (isComplete && session) {
    const handleReviewErrors = () => {
      const incorrectQuestions = session.questions.filter((q) => !q.isCorrect);
      if (incorrectQuestions.length > 0) {
        startReviewSession(incorrectQuestions);
      }
    };

    return (
      <QuizResults
        session={session}
        stats={stats}
        onNewQuiz={resetSession}
        onReviewErrors={handleReviewErrors}
      />
    );
  }

  // Show quiz game if we have an active session and question
  if (hasSession && currentQuestion && canAnswer) {
    return (
      <QuizGame
        currentQuestion={currentQuestion}
        progress={progress}
        isRetryPhase={isRetryPhase}
        onSubmitAnswer={submitAnswer}
        onNextQuestion={nextQuestion}
        onResetQuiz={resetSession}
      />
    );
  }

  // Show selection screen by default
  return <QuizSelection onStartQuiz={startSession} />;
}

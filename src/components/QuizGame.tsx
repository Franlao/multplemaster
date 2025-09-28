"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Question } from "../types/quiz";
import VoiceControls from "./VoiceControls";

interface QuizGameProps {
  currentQuestion: Question;
  progress: { current: number; total: number; percentage: number };
  isRetryPhase: boolean;
  onSubmitAnswer: (answer: number) => void;
  onNextQuestion: () => void;
  onResetQuiz: () => void;
}

export default function QuizGame({
  currentQuestion,
  progress,
  isRetryPhase,
  onSubmitAnswer,
  onNextQuestion,
  onResetQuiz,
}: QuizGameProps) {
  const [userInput, setUserInput] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when new question loads
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Reset states for new question
    setUserInput("");
    setShowFeedback(false);
    setIsCorrect(false);
  }, [currentQuestion.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const answer = parseInt(userInput, 10);
    if (Number.isNaN(answer)) return;

    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    onSubmitAnswer(answer);
  };

  const handleNext = () => {
    setShowFeedback(false);
    onNextQuestion();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showFeedback) {
      handleNext();
    }
  };

  const handleVoiceAnswer = useCallback((answer: number) => {
    if (showFeedback) return; // Prevent multiple submissions

    setUserInput(answer.toString());

    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    onSubmitAnswer(answer);
  }, [currentQuestion.correctAnswer, onSubmitAnswer, showFeedback]);

  return (
    <div className="max-w-2xl mx-auto p-8 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8">
        {/* Header with Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isRetryPhase ? "🔄 Révision" : "Quiz"}
            </h1>
            <button
              onClick={onResetQuiz}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              ← Retour
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Question {progress.current} sur {progress.total}
              </span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {isRetryPhase && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                💡 Phase de révision : Questions manquées à refaire
              </p>
            </div>
          )}
        </div>

        {/* Question Display */}
        <div className="text-center space-y-6">
          <div className="text-6xl font-bold text-gray-900 dark:text-white animate-in zoom-in duration-500">
            {currentQuestion.table} × {currentQuestion.multiplier} = ?
          </div>

          {!showFeedback ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                ref={inputRef}
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Votre réponse"
                className="w-full text-4xl text-center py-4 px-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                onKeyPress={handleKeyPress}
              />

              <button
                type="submit"
                disabled={!userInput}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-lg"
              >
                Valider
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Feedback */}
              <div
                className={`p-6 rounded-xl animate-in zoom-in duration-500 ${
                  isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}
              >
                <div className="text-center space-y-2">
                  <div
                    className={`text-4xl animate-bounce ${isCorrect ? "animate-pulse" : ""}`}
                  >
                    {isCorrect ? "✅" : "❌"}
                  </div>
                  <div
                    className={`text-xl font-semibold ${
                      isCorrect
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }`}
                  >
                    {isCorrect ? "Correct !" : "Incorrect"}
                  </div>
                  {!isCorrect && (
                    <div className="text-lg text-gray-700 dark:text-gray-300">
                      La bonne réponse est :{" "}
                      <span className="font-bold">
                        {currentQuestion.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-lg"
              >
                Question suivante
              </button>
            </div>
          )}
        </div>

        {/* Voice Controls */}
        <VoiceControls
          table={currentQuestion.table}
          multiplier={currentQuestion.multiplier}
          onVoiceAnswer={handleVoiceAnswer}
          isCorrect={isCorrect}
          correctAnswer={currentQuestion.correctAnswer}
          showFeedback={showFeedback}
          disabled={showFeedback}
        />

        {/* Question Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {currentQuestion.attempts > 0 && (
            <p>Tentatives : {currentQuestion.attempts + 1}</p>
          )}
        </div>
      </div>
    </div>
  );
}

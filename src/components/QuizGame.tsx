"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Question } from "../types/quiz";
import VoiceControls from "./VoiceControls";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Info } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="w-full min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border-2">
          <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            {/* Header with Progress */}
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                {isRetryPhase && <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />}
                {isRetryPhase ? "Révision" : "Quiz"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetQuiz}
                className="touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                <span>
                  Question {progress.current} / {progress.total}
                </span>
                <span className="font-medium">{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} max={100} />
            </div>

            {isRetryPhase && (
              <div className="flex items-start gap-2 p-2 sm:p-3 rounded-lg bg-warning/10 border border-warning/20">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-warning-foreground">
                  Phase de révision : Questions manquées à refaire
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
          {/* Question Display */}
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold py-4">
              {currentQuestion.table} × {currentQuestion.multiplier} = ?
            </div>

            {!showFeedback ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <Input
                  ref={inputRef}
                  type="number"
                  inputMode="numeric"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Votre réponse"
                  className="text-2xl sm:text-3xl md:text-4xl text-center py-4 sm:py-6 h-auto touch-manipulation"
                  onKeyPress={handleKeyPress}
                  autoFocus
                />

                <Button
                  type="submit"
                  disabled={!userInput}
                  size="lg"
                  className="w-full text-base sm:text-lg h-12 sm:h-14 touch-manipulation"
                >
                  Valider
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </form>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Feedback */}
                <div
                  className={cn(
                    "p-4 sm:p-6 rounded-lg border-2",
                    isCorrect
                      ? "bg-success/10 border-success/30"
                      : "bg-destructive/10 border-destructive/30"
                  )}
                >
                  <div className="text-center space-y-2 sm:space-y-3">
                    <div className="flex justify-center">
                      {isCorrect ? (
                        <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-success" />
                      ) : (
                        <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-destructive" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "text-lg sm:text-xl font-semibold",
                        isCorrect ? "text-success" : "text-destructive"
                      )}
                    >
                      {isCorrect ? "Correct !" : "Incorrect"}
                    </div>
                    {!isCorrect && (
                      <div className="text-sm sm:text-base">
                        La bonne réponse est :{" "}
                        <span className="font-bold text-base sm:text-lg">
                          {currentQuestion.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="w-full text-base sm:text-lg h-12 sm:h-14 touch-manipulation"
                >
                  Question suivante
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
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
          {currentQuestion.attempts > 0 && (
            <div className="text-center text-xs sm:text-sm text-muted-foreground">
              Tentatives : {currentQuestion.attempts + 1}
            </div>
          )}
        </CardContent>
        </Card>
      </div>
    </div>
  );
}

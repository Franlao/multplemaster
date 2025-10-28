"use client";

import type { QuizSession, QuizStats } from "../types/quiz";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Trophy,
  Star,
  ThumbsUp,
  Target,
  Clock,
  BarChart3,
  RotateCcw,
  Plus,
  CheckCircle2,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  session: QuizSession;
  stats: QuizStats;
  onNewQuiz: () => void;
  onReviewErrors: () => void;
}

export default function QuizResults({
  session,
  stats,
  onNewQuiz,
  onReviewErrors,
}: QuizResultsProps) {
  const accuracy = Math.round(
    (session.correctAnswers / session.totalQuestions) * 100,
  );
  const duration =
    session.endTime && session.startTime
      ? Math.round(
          (session.endTime.getTime() - session.startTime.getTime()) / 1000,
        )
      : 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return "text-success";
    if (acc >= 70) return "text-warning";
    return "text-destructive";
  };

  const getAccuracyIcon = (acc: number) => {
    if (acc === 100) return <Trophy className="w-16 h-16 text-success" />;
    if (acc >= 90) return <Star className="w-16 h-16 text-success" />;
    if (acc >= 70) return <ThumbsUp className="w-16 h-16 text-warning" />;
    return <Target className="w-16 h-16 text-destructive" />;
  };

  const getMotivationalMessage = (acc: number) => {
    if (acc === 100) return "Parfait ! Vous maîtrisez cette table !";
    if (acc >= 90) return "Excellent travail ! Encore un petit effort !";
    if (acc >= 70) return "Bon travail ! Continuez à vous entraîner !";
    return "Ne vous découragez pas ! La pratique mène à la perfection !";
  };

  return (
    <div className="w-full min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2">
          <CardHeader className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="flex justify-center">
              {getAccuracyIcon(accuracy)}
            </div>
            <CardTitle className="text-2xl sm:text-3xl">Quiz terminé !</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {getMotivationalMessage(accuracy)}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <Card>
              <CardContent className="pt-4 sm:pt-6 pb-4 text-center">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {session.correctAnswers}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Bonnes réponses
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6 pb-4 text-center">
                <List className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-2xl sm:text-3xl font-bold">
                  {session.totalQuestions}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Questions totales
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6 pb-4 text-center">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-success" />
                <div className={cn("text-2xl sm:text-3xl font-bold", getAccuracyColor(accuracy))}>
                  {accuracy}%
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Précision
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6 pb-4 text-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-2xl sm:text-3xl font-bold">
                  {formatDuration(duration)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Temps total
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              Détails de la session
            </h3>

            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Mode table :
                </span>
                <Badge variant="secondary" className="text-xs">
                  {session.settings.tableMode === "specific"
                    ? `Table de ${session.settings.selectedTable}`
                    : session.settings.tableMode === "multiple"
                    ? `${session.settings.selectedTables?.length} tables`
                    : "Aléatoire"}
                </Badge>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Mode questions :
                </span>
                <Badge variant="secondary" className="text-xs">
                  {session.settings.questionMode === "sequential"
                    ? "Séquentiel"
                    : "Aléatoire"}
                </Badge>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Questions ratées :
                </span>
                <Badge variant={session.questions.filter((q) => !q.isCorrect).length > 0 ? "destructive" : "success"} className="text-xs">
                  {session.questions.filter((q) => !q.isCorrect).length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              Statistiques globales
            </h3>

            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Sessions totales :
                </span>
                <span className="font-semibold text-sm sm:text-base">{stats.totalSessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Questions totales :
                </span>
                <span className="font-semibold text-sm sm:text-base">{stats.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Précision moyenne :
                </span>
                <span
                  className={cn("font-semibold text-sm sm:text-base", getAccuracyColor(stats.averageAccuracy))}
                >
                  {Math.round(stats.averageAccuracy)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:gap-3 pt-2">
            <Button
              onClick={onNewQuiz}
              size="lg"
              className="w-full text-base sm:text-lg h-12 sm:h-14 touch-manipulation"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Nouveau quiz
            </Button>

            {accuracy < 100 && (
              <Button
                onClick={onReviewErrors}
                variant="secondary"
                size="lg"
                className="w-full text-base sm:text-lg h-12 sm:h-14 touch-manipulation"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Réviser les erreurs
              </Button>
            )}
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}

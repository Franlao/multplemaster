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
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <Card className="border-2">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {getAccuracyIcon(accuracy)}
          </div>
          <CardTitle className="text-3xl">Quiz terminé !</CardTitle>
          <CardDescription className="text-base">
            {getMotivationalMessage(accuracy)}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-primary">
                  {session.correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Bonnes réponses
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <List className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-3xl font-bold">
                  {session.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Questions totales
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-success" />
                <div className={cn("text-3xl font-bold", getAccuracyColor(accuracy))}>
                  {accuracy}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Précision
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-3xl font-bold">
                  {formatDuration(duration)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Temps total
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Détails de la session
            </h3>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Mode table :
                </span>
                <Badge variant="secondary">
                  {session.settings.tableMode === "specific"
                    ? `Table de ${session.settings.selectedTable}`
                    : session.settings.tableMode === "multiple"
                    ? `Tables multiples (${session.settings.selectedTables?.join(', ')})`
                    : "Tables aléatoires"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Mode questions :
                </span>
                <Badge variant="secondary">
                  {session.settings.questionMode === "sequential"
                    ? "Séquentiel"
                    : "Aléatoire"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Questions ratées :
                </span>
                <Badge variant={session.questions.filter((q) => !q.isCorrect).length > 0 ? "destructive" : "success"}>
                  {session.questions.filter((q) => !q.isCorrect).length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Statistiques globales
            </h3>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Sessions totales :
                </span>
                <span className="font-semibold">{stats.totalSessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Questions totales :
                </span>
                <span className="font-semibold">{stats.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Précision moyenne :
                </span>
                <span
                  className={cn("font-semibold", getAccuracyColor(stats.averageAccuracy))}
                >
                  {Math.round(stats.averageAccuracy)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={onNewQuiz}
              size="lg"
              className="w-full text-base"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau quiz
            </Button>

            {accuracy < 100 && (
              <Button
                onClick={onReviewErrors}
                variant="secondary"
                size="lg"
                className="w-full text-base"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Réviser les erreurs
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

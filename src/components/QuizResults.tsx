"use client";

import type { QuizSession, QuizStats } from "../types/quiz";

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
    if (acc >= 90) return "text-green-600 dark:text-green-400";
    if (acc >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAccuracyEmoji = (acc: number) => {
    if (acc === 100) return "🏆";
    if (acc >= 90) return "🌟";
    if (acc >= 70) return "👍";
    return "💪";
  };

  return (
    <div className="max-w-2xl mx-auto p-8 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl animate-in zoom-in duration-1000 animate-bounce">
            {getAccuracyEmoji(accuracy)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white animate-in slide-in-from-top duration-700 delay-300">
            Quiz terminé !
          </h1>
          <p className="text-gray-600 dark:text-gray-400 animate-in slide-in-from-top duration-700 delay-500">
            Félicitations pour avoir terminé cette session
          </p>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center animate-in slide-in-from-left duration-500 delay-700 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {session.correctAnswers}
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              Bonnes réponses
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center animate-in slide-in-from-right duration-500 delay-700 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
              {session.totalQuestions}
            </div>
            <div className="text-sm text-gray-800 dark:text-gray-200">
              Questions totales
            </div>
          </div>

          <div
            className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center animate-in slide-in-from-left duration-500 delay-1000 hover:scale-105 transition-transform`}
          >
            <div className={`text-3xl font-bold ${getAccuracyColor(accuracy)}`}>
              {accuracy}%
            </div>
            <div className="text-sm text-green-800 dark:text-green-200">
              Précision
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 text-center animate-in slide-in-from-right duration-500 delay-1000 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {formatDuration(duration)}
            </div>
            <div className="text-sm text-purple-800 dark:text-purple-200">
              Temps total
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Détails de la session
          </h2>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Mode table :
              </span>
              <span className="font-medium">
                {session.settings.tableMode === "specific"
                  ? `Table de ${session.settings.selectedTable}`
                  : "Tables aléatoires"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Mode questions :
              </span>
              <span className="font-medium">
                {session.settings.questionMode === "sequential"
                  ? "Séquentiel"
                  : "Aléatoire"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Questions ratées :
              </span>
              <span className="font-medium">
                {session.questions.filter((q) => !q.isCorrect).length}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Statistiques globales
          </h2>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Sessions totales :
              </span>
              <span className="font-medium">{stats.totalSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Questions totales :
              </span>
              <span className="font-medium">{stats.totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Précision moyenne :
              </span>
              <span
                className={`font-medium ${getAccuracyColor(stats.averageAccuracy)}`}
              >
                {Math.round(stats.averageAccuracy)}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onNewQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-lg"
          >
            Nouveau quiz
          </button>

          {accuracy < 100 && (
            <button
              onClick={onReviewErrors}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Réviser les erreurs
            </button>
          )}
        </div>

        {/* Motivational Message */}
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          {accuracy === 100 && "🎉 Parfait ! Vous maîtrisez cette table !"}
          {accuracy >= 90 &&
            accuracy < 100 &&
            "✨ Excellent travail ! Encore un petit effort !"}
          {accuracy >= 70 &&
            accuracy < 90 &&
            "👏 Bon travail ! Continuez à vous entraîner !"}
          {accuracy < 70 &&
            "💪 Ne vous découragez pas ! La pratique mène à la perfection !"}
        </div>
      </div>
    </div>
  );
}

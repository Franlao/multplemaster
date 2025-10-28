"use client";

import { useState } from "react";
import { QuizSettings, TableMode, QuestionMode, Operation, AdvancedSettings as AdvancedSettingsType } from "../types/quiz";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { BookOpen, Grid3x3, Shuffle, ArrowRight, ListOrdered, Dices, Plus, Minus, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdvancedSettings } from "./AdvancedSettings";

interface QuizSelectionProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

export default function QuizSelection({ onStartQuiz }: QuizSelectionProps) {
  const [operation, setOperation] = useState<Operation>("multiplication");
  const [tableMode, setTableMode] = useState<TableMode>("specific");
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [selectedTables, setSelectedTables] = useState<number[]>([1, 2]);
  const [questionMode, setQuestionMode] = useState<QuestionMode>("sequential");
  const [questionCount, setQuestionCount] = useState<number>(11);
  const [settings, setSettings] = useState<AdvancedSettingsType>({
    tableSelectionMode: "range",
    tableRangeMin: 1,
    tableRangeMax: 10,
    specificTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    multiplierMin: 0,
    multiplierMax: 10,
  });

  // Get available numbers based on settings
  const getAvailableNumbers = () => {
    if (settings.tableSelectionMode === "range") {
      return Array.from(
        { length: settings.tableRangeMax - settings.tableRangeMin + 1 },
        (_, i) => settings.tableRangeMin + i
      );
    } else {
      return settings.specificTables;
    }
  };

  const getMaxQuestions = () => {
    return settings.multiplierMax - settings.multiplierMin + 1;
  };

  const getOperationLabel = () => {
    switch (operation) {
      case "addition": return "addition";
      case "subtraction": return "soustraction";
      case "multiplication": return "multiplication";
    }
  };

  const toggleTableSelection = (table: number) => {
    setSelectedTables(prev => {
      if (prev.includes(table)) {
        return prev.filter(t => t !== table);
      } else {
        return [...prev, table].sort((a, b) => a - b);
      }
    });
  };

  const handleStartQuiz = () => {
    const maxQuestions = getMaxQuestions();
    const quizSettings: QuizSettings = {
      operation,
      tableMode,
      selectedTable: tableMode === "specific" ? selectedTable : undefined,
      selectedTables: tableMode === "multiple" ? selectedTables : undefined,
      questionMode,
      questionCount: Math.min(questionCount, maxQuestions * getAvailableNumbers().length),
      advancedSettings: settings,
    };
    onStartQuiz(quizSettings);
  };

  const handleSettingsChange = (newSettings: AdvancedSettingsType) => {
    setSettings(newSettings);
    // Reset selected table if it's outside new range
    const availableNumbers = newSettings.tableSelectionMode === "range"
      ? Array.from({ length: newSettings.tableRangeMax - newSettings.tableRangeMin + 1 }, (_, i) => newSettings.tableRangeMin + i)
      : newSettings.specificTables;

    if (!availableNumbers.includes(selectedTable)) {
      setSelectedTable(availableNumbers[0] || 1);
    }

    // Reset selected tables if any are outside new range
    setSelectedTables(prev => prev.filter(t => availableNumbers.includes(t)));
  };

  return (
    <div className="w-full min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2">
          <CardHeader className="text-center space-y-2 p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1"></div>
              <div className="flex-1 text-center">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Ultrathink
                </CardTitle>
                <CardDescription className="text-sm sm:text-base mt-2">
                  Maîtrisez vos opérations mathématiques
                </CardDescription>
              </div>
              <div className="flex-1 flex justify-end">
                <AdvancedSettings
                  settings={settings}
                  onSettingsChange={handleSettingsChange}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6">
          {/* Operation Selection */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Dices className="w-4 h-4 sm:w-5 sm:h-5" />
              Type d'opération
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => setOperation("addition")}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left touch-manipulation",
                  operation === "addition"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 active:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="font-semibold text-sm sm:text-base">Addition</div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Calculer des sommes
                </div>
              </button>

              <button
                onClick={() => setOperation("subtraction")}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left touch-manipulation",
                  operation === "subtraction"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 active:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="font-semibold text-sm sm:text-base">Soustraction</div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Calculer des différences
                </div>
              </button>

              <button
                onClick={() => setOperation("multiplication")}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left touch-manipulation",
                  operation === "multiplication"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 active:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="font-semibold text-sm sm:text-base">Multiplication</div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Calculer des produits
                </div>
              </button>
            </div>
          </div>

          {/* Number Selection */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              Choix des nombres
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => setTableMode("specific")}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left touch-manipulation",
                  tableMode === "specific"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 active:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="font-semibold text-sm sm:text-base">Table spécifique</div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Choisir un nombre précis
                </div>
              </button>

              <button
                onClick={() => setTableMode("multiple")}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left touch-manipulation",
                  tableMode === "multiple"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 active:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="font-semibold text-sm sm:text-base">Tables multiples</div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Sélectionner plusieurs nombres
                </div>
              </button>

              <button
                onClick={() => setTableMode("random")}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left touch-manipulation",
                  tableMode === "random"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 active:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="font-semibold text-sm sm:text-base">Tables aléatoires</div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Nombres aléatoires
                </div>
              </button>
            </div>

            {/* Number Selection */}
            {tableMode === "specific" && (
              <div className="space-y-3 p-3 sm:p-4 rounded-lg bg-muted/50">
                <label className="block text-xs sm:text-sm font-medium">
                  Nombre de base ({settings.tableRangeMin}-{settings.tableRangeMax})
                </label>
                <div className="grid grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-9 gap-1.5 sm:gap-2">
                  {getAvailableNumbers().map((num) => (
                    <Button
                      key={num}
                      variant={selectedTable === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTable(num)}
                      className="h-10 sm:h-11 text-sm sm:text-base touch-manipulation"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Multiple Numbers Selection */}
            {tableMode === "multiple" && (
              <div className="space-y-3 p-3 sm:p-4 rounded-lg bg-muted/50">
                <label className="block text-xs sm:text-sm font-medium">
                  Nombres de base (sélectionnez plusieurs)
                </label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {selectedTables.length} nombre{selectedTables.length > 1 ? 's' : ''} sélectionné{selectedTables.length > 1 ? 's' : ''}: {selectedTables.join(', ')}
                </p>
                <div className="grid grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-9 gap-1.5 sm:gap-2">
                  {getAvailableNumbers().map((num) => (
                    <Button
                      key={num}
                      variant={selectedTables.includes(num) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTableSelection(num)}
                      className="h-10 sm:h-11 text-sm sm:text-base touch-manipulation"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Question Mode Selection */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Dices className="w-4 h-4 sm:w-5 sm:h-5" />
              Mode des questions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => setQuestionMode("sequential")}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left touch-manipulation",
                  questionMode === "sequential"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 active:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ListOrdered className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="font-semibold text-sm sm:text-base">Séquentiel</div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Dans l'ordre (0×n, 1×n, 2×n...)
                </div>
              </button>

              <button
                onClick={() => setQuestionMode("random")}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left touch-manipulation",
                  questionMode === "random"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 active:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="font-semibold text-sm sm:text-base">Aléatoire</div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Ordre mélangé</div>
              </button>
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-medium">
                Nombre de questions
              </label>
              <span className="text-xs text-muted-foreground">
                Multiplicateurs: {settings.multiplierMin}-{settings.multiplierMax}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={tableMode === "specific" ? getMaxQuestions() : tableMode === "multiple" ? Math.min(selectedTables.length * getMaxQuestions(), 100) : 50}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary touch-manipulation"
            />
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>1</span>
              <span className="font-semibold text-foreground">{questionCount} questions</span>
              <span>{tableMode === "specific" ? getMaxQuestions() : tableMode === "multiple" ? Math.min(selectedTables.length * getMaxQuestions(), 100) : 50}</span>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartQuiz}
            disabled={tableMode === "multiple" && selectedTables.length === 0}
            size="lg"
            className="w-full text-base sm:text-lg h-12 sm:h-14 touch-manipulation"
          >
            Commencer le quiz
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}

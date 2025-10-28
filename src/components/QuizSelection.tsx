"use client";

import { useState } from "react";
import { QuizSettings, TableMode, QuestionMode } from "../types/quiz";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { BookOpen, Grid3x3, Shuffle, ArrowRight, ListOrdered, Dices } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizSelectionProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

export default function QuizSelection({ onStartQuiz }: QuizSelectionProps) {
  const [tableMode, setTableMode] = useState<TableMode>("specific");
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [selectedTables, setSelectedTables] = useState<number[]>([1, 2]);
  const [questionMode, setQuestionMode] = useState<QuestionMode>("sequential");
  const [questionCount, setQuestionCount] = useState<number>(21);

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
    const settings: QuizSettings = {
      tableMode,
      selectedTable: tableMode === "specific" ? selectedTable : undefined,
      selectedTables: tableMode === "multiple" ? selectedTables : undefined,
      questionMode,
      questionCount:
        tableMode === "specific" ? Math.min(questionCount, 21) : questionCount,
    };
    onStartQuiz(settings);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <Card className="border-2">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Ultrathink
          </CardTitle>
          <CardDescription className="text-base">
            Maîtrisez vos tables de multiplication
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Table Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Choix de la table
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setTableMode("specific")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  tableMode === "specific"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5" />
                  <div className="font-semibold">Table spécifique</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Choisir une table précise
                </div>
              </button>

              <button
                onClick={() => setTableMode("multiple")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  tableMode === "multiple"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Grid3x3 className="w-5 h-5" />
                  <div className="font-semibold">Tables multiples</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Sélectionner plusieurs tables
                </div>
              </button>

              <button
                onClick={() => setTableMode("random")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  tableMode === "random"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shuffle className="w-5 h-5" />
                  <div className="font-semibold">Tables aléatoires</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Mélange de toutes les tables
                </div>
              </button>
            </div>

            {/* Table Number Selection */}
            {tableMode === "specific" && (
              <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                <label className="block text-sm font-medium">
                  Table de multiplication (0-35)
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                  {Array.from({ length: 36 }, (_, i) => i).map((num) => (
                    <Button
                      key={num}
                      variant={selectedTable === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTable(num)}
                      className="h-10"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Multiple Tables Selection */}
            {tableMode === "multiple" && (
              <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                <label className="block text-sm font-medium">
                  Tables de multiplication (sélectionnez plusieurs)
                </label>
                <p className="text-sm text-muted-foreground">
                  {selectedTables.length} table{selectedTables.length > 1 ? 's' : ''} sélectionnée{selectedTables.length > 1 ? 's' : ''}: {selectedTables.join(', ')}
                </p>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                  {Array.from({ length: 36 }, (_, i) => i).map((num) => (
                    <Button
                      key={num}
                      variant={selectedTables.includes(num) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTableSelection(num)}
                      className="h-10"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Question Mode Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Dices className="w-5 h-5" />
              Mode des questions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setQuestionMode("sequential")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  questionMode === "sequential"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ListOrdered className="w-5 h-5" />
                  <div className="font-semibold">Séquentiel</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Dans l'ordre (0×n, 1×n, 2×n...)
                </div>
              </button>

              <button
                onClick={() => setQuestionMode("random")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  questionMode === "random"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shuffle className="w-5 h-5" />
                  <div className="font-semibold">Aléatoire</div>
                </div>
                <div className="text-sm text-muted-foreground">Ordre mélangé</div>
              </button>
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Nombre de questions
            </label>
            <input
              type="range"
              min={tableMode === "specific" ? 1 : tableMode === "multiple" ? selectedTables.length : 5}
              max={tableMode === "specific" ? 21 : tableMode === "multiple" ? selectedTables.length * 21 : 50}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{tableMode === "specific" ? 1 : tableMode === "multiple" ? selectedTables.length : 5}</span>
              <span className="font-semibold text-foreground">{questionCount} questions</span>
              <span>{tableMode === "specific" ? 21 : tableMode === "multiple" ? selectedTables.length * 21 : 50}</span>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartQuiz}
            disabled={tableMode === "multiple" && selectedTables.length === 0}
            size="lg"
            className="w-full text-base"
          >
            Commencer le quiz
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

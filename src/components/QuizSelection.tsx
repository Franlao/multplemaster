"use client";

import { useState } from "react";
import { QuizSettings, TableMode, QuestionMode } from "../types/quiz";

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
    <div className="max-w-2xl mx-auto p-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8 transform hover:scale-[1.02] transition-transform duration-300">
        {/* Header */}
        <div className="text-center animate-in slide-in-from-top duration-700">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ultrathink
          </h1>
          <p className="text-gray-600 dark:text-gray-400 animate-in slide-in-from-top duration-700 delay-150">
            Maîtrisez vos tables de multiplication
          </p>
        </div>

        {/* Table Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Choix de la table
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTableMode("specific")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                tableMode === "specific"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-lg font-medium">Table spécifique</div>
              <div className="text-sm opacity-70">
                Choisir une table précise
              </div>
            </button>

            <button
              onClick={() => setTableMode("multiple")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                tableMode === "multiple"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-lg font-medium">Tables multiples</div>
              <div className="text-sm opacity-70">
                Sélectionner plusieurs tables
              </div>
            </button>

            <button
              onClick={() => setTableMode("random")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                tableMode === "random"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-lg font-medium">Tables aléatoires</div>
              <div className="text-sm opacity-70">
                Mélange de toutes les tables
              </div>
            </button>
          </div>

          {/* Table Number Selection */}
          {tableMode === "specific" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Table de multiplication (0-35)
              </label>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 36 }, (_, i) => i).map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedTable(num)}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      selectedTable === num
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Multiple Tables Selection */}
          {tableMode === "multiple" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tables de multiplication (sélectionnez plusieurs)
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedTables.length} table{selectedTables.length > 1 ? 's' : ''} sélectionnée{selectedTables.length > 1 ? 's' : ''}: {selectedTables.join(', ')}
              </p>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 36 }, (_, i) => i).map((num) => (
                  <button
                    key={num}
                    onClick={() => toggleTableSelection(num)}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      selectedTables.includes(num)
                        ? "border-purple-500 bg-purple-500 text-white"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Question Mode Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Mode des questions
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setQuestionMode("sequential")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                questionMode === "sequential"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-lg font-medium">Séquentiel</div>
              <div className="text-sm opacity-70">
                Dans l'ordre (0×n, 1×n, 2×n...)
              </div>
            </button>

            <button
              onClick={() => setQuestionMode("random")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                questionMode === "random"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-lg font-medium">Aléatoire</div>
              <div className="text-sm opacity-70">Ordre mélangé</div>
            </button>
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre de questions
          </label>
          <input
            type="range"
            min={tableMode === "specific" ? 1 : tableMode === "multiple" ? selectedTables.length : 5}
            max={tableMode === "specific" ? 21 : tableMode === "multiple" ? selectedTables.length * 21 : 50}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{tableMode === "specific" ? 1 : tableMode === "multiple" ? selectedTables.length : 5}</span>
            <span className="font-medium">{questionCount} questions</span>
            <span>{tableMode === "specific" ? 21 : tableMode === "multiple" ? selectedTables.length * 21 : 50}</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          disabled={tableMode === "multiple" && selectedTables.length === 0}
          className={`w-full font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-lg ${
            tableMode === "multiple" && selectedTables.length === 0
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Commencer le quiz
        </button>
      </div>
    </div>
  );
}

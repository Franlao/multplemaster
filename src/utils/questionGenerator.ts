import { Question, QuizSettings } from "../types/quiz";

export function generateQuestions(settings: QuizSettings): Question[] {
  const { tableMode, selectedTable, questionMode, questionCount } = settings;

  const tables =
    tableMode === "specific" && selectedTable !== undefined
      ? [selectedTable]
      : getRandomTables(questionCount);

  const questions: Question[] = [];

  if (tableMode === "specific" && selectedTable !== undefined) {
    // Generate questions for a specific table
    const multipliers =
      questionMode === "sequential"
        ? getSequentialMultipliers(questionCount)
        : getRandomMultipliers(questionCount);

    multipliers.forEach((multiplier, index) => {
      questions.push(createQuestion(selectedTable, multiplier, index));
    });
  } else {
    // Generate questions with random tables
    for (let i = 0; i < questionCount; i++) {
      const table = tables[i % tables.length];
      const multiplier = Math.floor(Math.random() * 21); // 0-20
      questions.push(createQuestion(table, multiplier, i));
    }
  }

  return questionMode === "random" && tableMode === "specific"
    ? shuffleArray(questions)
    : questions;
}

function createQuestion(
  table: number,
  multiplier: number,
  index: number,
): Question {
  return {
    id: `${table}x${multiplier}-${index}-${Date.now()}`,
    table,
    multiplier,
    correctAnswer: table * multiplier,
    attempts: 0,
    timeAsked: new Date(),
  };
}

function getSequentialMultipliers(count: number): number[] {
  const multipliers: number[] = [];
  for (let i = 0; i < Math.min(count, 21); i++) {
    multipliers.push(i);
  }
  return multipliers;
}

function getRandomMultipliers(count: number): number[] {
  const multipliers = Array.from({ length: 21 }, (_, i) => i);
  return shuffleArray(multipliers).slice(0, count);
}

function getRandomTables(count: number): number[] {
  const tables: number[] = [];
  for (let i = 0; i < count; i++) {
    tables.push(Math.floor(Math.random() * 21)); // 0-20
  }
  return tables;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createRetryQuestions(failedQuestions: Question[]): Question[] {
  return failedQuestions.map((question, index) => ({
    ...question,
    id: `retry-${question.id}-${Date.now()}`,
    attempts: 0,
    userAnswer: undefined,
    isCorrect: undefined,
    timeAsked: new Date(),
  }));
}

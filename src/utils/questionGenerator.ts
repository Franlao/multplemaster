import { Question, QuizSettings, Operation } from "../types/quiz";

export function generateQuestions(settings: QuizSettings): Question[] {
  const { operation, tableMode, selectedTable, selectedTables, questionMode, questionCount, advancedSettings } = settings;

  const questions: Question[] = [];

  // Determine first numbers based on advanced settings or mode
  let firstNumbers: number[] = [];

  if (advancedSettings) {
    if (advancedSettings.tableSelectionMode === "range") {
      // Use range from advanced settings
      firstNumbers = Array.from(
        { length: advancedSettings.tableRangeMax - advancedSettings.tableRangeMin + 1 },
        (_, i) => advancedSettings.tableRangeMin + i
      );
    } else {
      // Use specific tables from advanced settings
      firstNumbers = [...advancedSettings.specificTables];
    }
  } else if (tableMode === "specific" && selectedTable !== undefined) {
    firstNumbers = [selectedTable];
  } else if (tableMode === "multiple" && selectedTables && selectedTables.length > 0) {
    firstNumbers = [...selectedTables];
  }

  if (firstNumbers.length > 0) {
    // Generate questions for specified first numbers
    const questionsPerNumber = Math.floor(questionCount / firstNumbers.length);
    const extraQuestions = questionCount % firstNumbers.length;

    firstNumbers.forEach((firstNumber, numberIndex) => {
      const questionsForThisNumber = questionsPerNumber + (numberIndex < extraQuestions ? 1 : 0);

      if (questionMode === "sequential") {
        const secondNumbers = getSequentialNumbers(questionsForThisNumber, operation, advancedSettings);
        secondNumbers.forEach((secondNumber) => {
          questions.push(createQuestion(operation, firstNumber, secondNumber, questions.length));
        });
      } else {
        const secondNumbers = getRandomNumbers(questionsForThisNumber, operation, advancedSettings);
        secondNumbers.forEach((secondNumber) => {
          questions.push(createQuestion(operation, firstNumber, secondNumber, questions.length));
        });
      }
    });
  } else {
    // Generate questions with random numbers
    for (let i = 0; i < questionCount; i++) {
      const firstNumber = getRandomNumberForOperation(operation, advancedSettings);
      const secondNumber = getRandomNumberForOperation(operation, advancedSettings);
      questions.push(createQuestion(operation, firstNumber, secondNumber, i));
    }
  }

  return questionMode === "random" && firstNumbers.length > 0
    ? shuffleArray(questions)
    : questions;
}

function createQuestion(
  operation: Operation,
  firstNumber: number,
  secondNumber: number,
  index: number,
): Question {
  let correctAnswer: number;
  let opSymbol: string;

  switch (operation) {
    case "addition":
      correctAnswer = firstNumber + secondNumber;
      opSymbol = "+";
      break;
    case "subtraction":
      // Ensure result is not negative
      if (firstNumber < secondNumber) {
        [firstNumber, secondNumber] = [secondNumber, firstNumber];
      }
      correctAnswer = firstNumber - secondNumber;
      opSymbol = "-";
      break;
    case "multiplication":
      correctAnswer = firstNumber * secondNumber;
      opSymbol = "×";
      break;
  }

  return {
    id: `${firstNumber}${opSymbol}${secondNumber}-${index}-${Date.now()}`,
    operation,
    firstNumber,
    secondNumber,
    correctAnswer,
    attempts: 0,
    timeAsked: new Date(),
    // Legacy fields for backward compatibility
    table: firstNumber,
    multiplier: secondNumber,
  };
}

function getSequentialNumbers(
  count: number,
  operation: Operation,
  advancedSettings?: QuizSettings["advancedSettings"]
): number[] {
  const numbers: number[] = [];

  let min: number;
  let max: number;

  if (advancedSettings) {
    min = advancedSettings.multiplierMin;
    max = advancedSettings.multiplierMax;
  } else {
    // Default ranges
    min = 0;
    max = operation === "multiplication" ? 20 : 100;
  }

  for (let i = min; i <= max && numbers.length < count; i++) {
    numbers.push(i);
  }
  return numbers;
}

function getRandomNumbers(
  count: number,
  operation: Operation,
  advancedSettings?: QuizSettings["advancedSettings"]
): number[] {
  let min: number;
  let max: number;

  if (advancedSettings) {
    min = advancedSettings.multiplierMin;
    max = advancedSettings.multiplierMax;
  } else {
    // Default ranges
    min = 0;
    max = operation === "multiplication" ? 20 : 100;
  }

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return shuffleArray(numbers).slice(0, count);
}

function getRandomNumberForOperation(
  operation: Operation,
  advancedSettings?: QuizSettings["advancedSettings"]
): number {
  let min: number;
  let max: number;

  if (advancedSettings) {
    if (advancedSettings.tableSelectionMode === "range") {
      min = advancedSettings.tableRangeMin;
      max = advancedSettings.tableRangeMax;
    } else {
      // Pick randomly from specific tables
      const tables = advancedSettings.specificTables;
      return tables[Math.floor(Math.random() * tables.length)];
    }
  } else {
    // Default ranges
    if (operation === "multiplication") {
      min = 0;
      max = 35;
    } else {
      min = 0;
      max = 100;
    }
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
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

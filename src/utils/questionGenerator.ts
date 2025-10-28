import { Question, QuizSettings, Operation } from "../types/quiz";

export function generateQuestions(settings: QuizSettings): Question[] {
  const { operation, tableMode, selectedTable, selectedTables, questionMode, questionCount } = settings;

  const questions: Question[] = [];

  if (tableMode === "specific" && selectedTable !== undefined) {
    // Generate questions for a specific number
    const secondNumbers =
      questionMode === "sequential"
        ? getSequentialNumbers(questionCount, operation)
        : getRandomNumbers(questionCount, operation);

    secondNumbers.forEach((secondNumber, index) => {
      questions.push(createQuestion(operation, selectedTable, secondNumber, index));
    });
  } else if (tableMode === "multiple" && selectedTables && selectedTables.length > 0) {
    // Generate questions for multiple selected numbers
    const questionsPerNumber = Math.floor(questionCount / selectedTables.length);
    const extraQuestions = questionCount % selectedTables.length;

    selectedTables.forEach((firstNumber, numberIndex) => {
      const questionsForThisNumber = questionsPerNumber + (numberIndex < extraQuestions ? 1 : 0);

      if (questionMode === "sequential") {
        const secondNumbers = getSequentialNumbers(questionsForThisNumber, operation);
        secondNumbers.forEach((secondNumber) => {
          questions.push(createQuestion(operation, firstNumber, secondNumber, questions.length));
        });
      } else {
        const secondNumbers = getRandomNumbers(questionsForThisNumber, operation);
        secondNumbers.forEach((secondNumber) => {
          questions.push(createQuestion(operation, firstNumber, secondNumber, questions.length));
        });
      }
    });
  } else {
    // Generate questions with random numbers
    for (let i = 0; i < questionCount; i++) {
      const firstNumber = getRandomNumberForOperation(operation);
      const secondNumber = getRandomNumberForOperation(operation);
      questions.push(createQuestion(operation, firstNumber, secondNumber, i));
    }
  }

  return questionMode === "random" && (tableMode === "specific" || tableMode === "multiple")
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

function getSequentialNumbers(count: number, operation: Operation): number[] {
  const numbers: number[] = [];
  const maxRange = operation === "multiplication" ? 21 : 101; // 0-20 for mult, 0-100 for add/sub

  for (let i = 0; i < Math.min(count, maxRange); i++) {
    numbers.push(i);
  }
  return numbers;
}

function getRandomNumbers(count: number, operation: Operation): number[] {
  const maxRange = operation === "multiplication" ? 21 : 101;
  const numbers = Array.from({ length: maxRange }, (_, i) => i);
  return shuffleArray(numbers).slice(0, count);
}

function getRandomNumberForOperation(operation: Operation): number {
  if (operation === "multiplication") {
    return Math.floor(Math.random() * 36); // 0-35 for multiplication
  } else {
    return Math.floor(Math.random() * 101); // 0-100 for addition/subtraction
  }
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

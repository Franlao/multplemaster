"use client";

import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

interface VoiceControlsProps {
  table: number;
  multiplier: number;
  onVoiceAnswer: (answer: number) => void;
  isCorrect?: boolean;
  correctAnswer?: number;
  showFeedback?: boolean;
  disabled?: boolean;
}

export default function VoiceControls({
  table,
  multiplier,
  onVoiceAnswer,
  isCorrect,
  correctAnswer,
  showFeedback = false,
  disabled = false,
}: VoiceControlsProps) {
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [sttEnabled, setSttEnabled] = useState(false);

  const {
    speakQuestion,
    speakFeedback,
    isPlaying,
    cancel: cancelSpeech,
    isSupported: ttsSupported,
  } = useSpeechSynthesis();

  const {
    listenForNumber,
    stopListening,
    getNumberFromTranscript,
    transcript,
    isListening,
    isProcessing,
    result,
    clearResult,
    isSupported: sttSupported,
  } = useSpeechRecognition();

  // Handle voice recognition result
  useEffect(() => {
    if (result && result.isFinal && sttEnabled) {
      const number = getNumberFromTranscript(result.transcript);
      if (number !== null && number >= 0 && number <= 1000) {
        onVoiceAnswer(number);
        clearResult(); // Clear result to prevent re-processing
        stopListening();
      }
    }
  }, [
    result,
    sttEnabled,
    getNumberFromTranscript,
    onVoiceAnswer,
    clearResult,
    stopListening,
  ]);

  // Auto-read feedback if enabled and feedback is shown
  useEffect(() => {
    if (ttsEnabled && showFeedback && isCorrect !== undefined) {
      speakFeedback(isCorrect, correctAnswer);
    }
  }, [ttsEnabled, showFeedback, isCorrect, correctAnswer, speakFeedback]);

  const handleReadQuestion = () => {
    if (isPlaying) {
      cancelSpeech();
    } else {
      speakQuestion(table, multiplier);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      listenForNumber();
    }
  };

  if (!ttsSupported && !sttSupported) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
        Contrôles vocaux
      </h3>

      <div className="flex flex-wrap gap-3 justify-center">
        {/* Text-to-Speech Controls */}
        {ttsSupported && (
          <div className="flex flex-col items-center space-y-2">
            <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={ttsEnabled}
                onChange={(e) => setTtsEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Lecture vocale</span>
            </label>

            <button
              onClick={handleReadQuestion}
              disabled={disabled || !ttsEnabled}
              className={`p-3 rounded-full transition-all duration-200 ${
                ttsEnabled && !disabled
                  ? isPlaying
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              title={isPlaying ? "Arrêter la lecture" : "Lire la question"}
            >
              {isPlaying ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.045 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.045l4.338-3.814a1 1 0 011 0zM15 8a3 3 0 000 6V8z"
                    clipRule="evenodd"
                  />
                  <path d="M17.609 6.205a5 5 0 010 7.59l-.707-.707a4 4 0 000-6.176l.707-.707z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Speech-to-Text Controls */}
        {sttSupported && (
          <div className="flex flex-col items-center space-y-2">
            <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={sttEnabled}
                onChange={(e) => setSttEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Réponse vocale</span>
            </label>

            <button
              onClick={handleVoiceInput}
              disabled={disabled || !sttEnabled || showFeedback}
              className={`p-3 rounded-full transition-all duration-200 ${
                sttEnabled && !disabled && !showFeedback
                  ? isListening
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : isProcessing
                      ? "bg-yellow-500 text-white animate-spin"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              title={
                isListening
                  ? "Arrêter l'écoute"
                  : isProcessing
                    ? "Traitement en cours..."
                    : "Commencer l'écoute"
              }
            >
              {isProcessing ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Voice Recognition Feedback */}
      {sttEnabled && (isListening || transcript) && (
        <div className="text-center">
          {isListening && (
            <p className="text-sm text-blue-600 dark:text-blue-400 animate-pulse">
              🎤 Écoutez... Dites votre réponse
            </p>
          )}
          {transcript && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Entendu : "{transcript}"
            </p>
          )}
        </div>
      )}

      {/* Support Information */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        {ttsSupported && sttSupported
          ? "Lecture et reconnaissance vocale disponibles"
          : ttsSupported
            ? "Seule la lecture vocale est disponible"
            : sttSupported
              ? "Seule la reconnaissance vocale est disponible"
              : "Fonctionnalités vocales non supportées"}
      </div>
    </div>
  );
}

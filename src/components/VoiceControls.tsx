"use client";

import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import { Volume2, VolumeX, Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="text-sm font-medium text-center">
          Contrôles vocaux
        </h3>

        <div className="flex flex-wrap gap-4 justify-center">
          {/* Text-to-Speech Controls */}
          {ttsSupported && (
            <div className="flex flex-col items-center space-y-2">
              <label className="flex items-center space-x-2 text-sm text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={ttsEnabled}
                  onCheckedChange={(checked) => setTtsEnabled(checked === true)}
                />
                <span>Lecture vocale</span>
              </label>

              <Button
                onClick={handleReadQuestion}
                disabled={disabled || !ttsEnabled}
                variant={isPlaying ? "destructive" : "default"}
                size="icon"
                className={cn(
                  "rounded-full w-12 h-12",
                  isPlaying && "animate-pulse"
                )}
                title={isPlaying ? "Arrêter la lecture" : "Lire la question"}
              >
                {isPlaying ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          )}

          {/* Speech-to-Text Controls */}
          {sttSupported && (
            <div className="flex flex-col items-center space-y-2">
              <label className="flex items-center space-x-2 text-sm text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={sttEnabled}
                  onCheckedChange={(checked) => setSttEnabled(checked === true)}
                />
                <span>Réponse vocale</span>
              </label>

              <Button
                onClick={handleVoiceInput}
                disabled={disabled || !sttEnabled || showFeedback}
                variant={isListening ? "destructive" : "secondary"}
                size="icon"
                className={cn(
                  "rounded-full w-12 h-12",
                  isListening && "animate-pulse",
                  isProcessing && "animate-spin"
                )}
                title={
                  isListening
                    ? "Arrêter l'écoute"
                    : isProcessing
                    ? "Traitement en cours..."
                    : "Commencer l'écoute"
                }
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5" />
                ) : isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Voice Recognition Feedback */}
        {sttEnabled && (isListening || transcript) && (
          <div className="text-center space-y-1">
            {isListening && (
              <p className="text-sm text-primary animate-pulse flex items-center justify-center gap-2">
                <Mic className="w-4 h-4" />
                Écoutez... Dites votre réponse
              </p>
            )}
            {transcript && (
              <p className="text-sm text-muted-foreground">
                Entendu : "{transcript}"
              </p>
            )}
          </div>
        )}

        {/* Support Information */}
        <div className="text-center text-xs text-muted-foreground">
          {ttsSupported && sttSupported
            ? "Lecture et reconnaissance vocale disponibles"
            : ttsSupported
            ? "Seule la lecture vocale est disponible"
            : sttSupported
            ? "Seule la reconnaissance vocale est disponible"
            : "Fonctionnalités vocales non supportées"}
        </div>
      </CardContent>
    </Card>
  );
}

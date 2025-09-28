"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  SpeechSynthesisConfig,
  SpeechSynthesisStatus,
  VoiceError,
} from "../types/voice";

export function useSpeechSynthesis() {
  const [status, setStatus] = useState<SpeechSynthesisStatus>("idle");
  const [error, setError] = useState<VoiceError | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const supported = "speechSynthesis" in window;
    setIsSupported(supported);

    if (!supported) {
      setStatus("not-supported");
      setError({
        code: "NOT_SUPPORTED",
        message: "Speech synthesis is not supported in this browser",
      });
      return;
    }

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (config: SpeechSynthesisConfig) => {
      if (!isSupported) {
        setError({
          code: "NOT_SUPPORTED",
          message: "Speech synthesis is not supported",
        });
        return;
      }

      try {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(config.text);
        utteranceRef.current = utterance;

        // Configuration
        utterance.rate = config.rate ?? 1;
        utterance.pitch = config.pitch ?? 1;
        utterance.lang = config.lang ?? "fr-FR";

        // Find French voice if available
        const frenchVoice = voices.find(
          (voice) => voice.lang.startsWith("fr") || voice.lang.includes("fr"),
        );
        if (frenchVoice) {
          utterance.voice = frenchVoice;
        }

        // Event handlers
        utterance.onstart = () => {
          setStatus("speaking");
          setError(null);
        };

        utterance.onend = () => {
          setStatus("idle");
          utteranceRef.current = null;
        };

        utterance.onerror = (event) => {
          setStatus("error");
          setError({
            code: "SPEECH_ERROR",
            message: `Speech synthesis error: ${event.error}`,
          });
          utteranceRef.current = null;
        };

        utterance.onpause = () => {
          setStatus("paused");
        };

        utterance.onresume = () => {
          setStatus("speaking");
        };

        speechSynthesis.speak(utterance);
      } catch (err) {
        setStatus("error");
        setError({
          code: "SPEECH_ERROR",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
    [isSupported, voices],
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.pause();
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.resume();
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setStatus("idle");
    utteranceRef.current = null;
  }, [isSupported]);

  const speakQuestion = useCallback(
    (table: number, multiplier: number) => {
      speak({
        text: `${table} fois ${multiplier} égale ?`,
        rate: 0.9,
        lang: "fr-FR",
      });
    },
    [speak],
  );

  const speakFeedback = useCallback(
    (isCorrect: boolean, correctAnswer?: number) => {
      const text = isCorrect
        ? "Correct !"
        : `Incorrect. La bonne réponse est ${correctAnswer}`;

      speak({
        text,
        rate: 0.9,
        lang: "fr-FR",
      });
    },
    [speak],
  );

  return {
    status,
    error,
    isSupported,
    voices,
    speak,
    pause,
    resume,
    cancel,
    speakQuestion,
    speakFeedback,
    isPlaying: status === "speaking",
    isPaused: status === "paused",
    canSpeak: isSupported && status !== "speaking",
  };
}

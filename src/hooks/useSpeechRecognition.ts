"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  SpeechRecognitionConfig,
  SpeechRecognitionResult,
  SpeechRecognitionStatus,
  VoiceError,
} from "../types/voice";

// Extend window type for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeechRecognition() {
  const [status, setStatus] = useState<SpeechRecognitionStatus>("idle");
  const [error, setError] = useState<VoiceError | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [result, setResult] = useState<SpeechRecognitionResult | null>(null);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = !!SpeechRecognition;
    setIsSupported(supported);

    if (!supported) {
      setStatus("not-supported");
      setError({
        code: "NOT_SUPPORTED",
        message: "Speech recognition is not supported in this browser",
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Convert French number words to digits
  const convertFrenchNumberToDigits = useCallback(
    (text: string): number | null => {
      const cleanText = text.toLowerCase().trim();

      // Direct number mapping
      const numberWords: Record<string, number> = {
        zéro: 0,
        zero: 0,
        un: 1,
        une: 1,
        deux: 2,
        trois: 3,
        quatre: 4,
        cinq: 5,
        six: 6,
        sept: 7,
        huit: 8,
        neuf: 9,
        dix: 10,
        onze: 11,
        douze: 12,
        treize: 13,
        quatorze: 14,
        quinze: 15,
        seize: 16,
        "dix-sept": 17,
        "dix sept": 17,
        "dix-huit": 18,
        "dix huit": 18,
        "dix-neuf": 19,
        "dix neuf": 19,
        vingt: 20,
        trente: 30,
        quarante: 40,
        cinquante: 50,
        soixante: 60,
        "soixante-dix": 70,
        "soixante dix": 70,
        "quatre-vingts": 80,
        "quatre vingts": 80,
        "quatre-vingt-dix": 90,
        "quatre vingt dix": 90,
        cent: 100,
      };

      // Check direct matches first
      if (numberWords[cleanText] !== undefined) {
        return numberWords[cleanText];
      }

      // Try to parse as regular number
      const numMatch = cleanText.match(/\d+/);
      if (numMatch) {
        return parseInt(numMatch[0], 10);
      }

      // Handle compound numbers (e.g., "vingt-deux", "soixante-quinze")
      const parts = cleanText.split(/[-\s]+/);
      if (parts.length === 2) {
        const [tens, ones] = parts;
        const tensValue = numberWords[tens] || 0;
        const onesValue = numberWords[ones] || 0;

        if (tensValue >= 20 && onesValue < 10) {
          return tensValue + onesValue;
        }
      }

      // Handle "soixante" variations
      if (cleanText.includes("soixante")) {
        if (cleanText.includes("onze")) return 71;
        if (cleanText.includes("douze")) return 72;
        if (cleanText.includes("treize")) return 73;
        if (cleanText.includes("quatorze")) return 74;
        if (cleanText.includes("quinze")) return 75;
        if (cleanText.includes("seize")) return 76;
        if (cleanText.includes("dix-sept") || cleanText.includes("dix sept"))
          return 77;
        if (cleanText.includes("dix-huit") || cleanText.includes("dix huit"))
          return 78;
        if (cleanText.includes("dix-neuf") || cleanText.includes("dix neuf"))
          return 79;
      }

      // Handle "quatre-vingt" variations
      if (
        cleanText.includes("quatre-vingt") ||
        cleanText.includes("quatre vingt")
      ) {
        if (cleanText.includes("onze")) return 91;
        if (cleanText.includes("douze")) return 92;
        if (cleanText.includes("treize")) return 93;
        if (cleanText.includes("quatorze")) return 94;
        if (cleanText.includes("quinze")) return 95;
        if (cleanText.includes("seize")) return 96;
        if (cleanText.includes("dix-sept") || cleanText.includes("dix sept"))
          return 97;
        if (cleanText.includes("dix-huit") || cleanText.includes("dix huit"))
          return 98;
        if (cleanText.includes("dix-neuf") || cleanText.includes("dix neuf"))
          return 99;
      }

      return null;
    },
    [],
  );

  const startListening = useCallback(
    (config: SpeechRecognitionConfig = {}) => {
      if (!isSupported) {
        setError({
          code: "NOT_SUPPORTED",
          message: "Speech recognition is not supported",
        });
        return;
      }

      try {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        // Configuration
        recognition.continuous = config.continuous ?? false;
        recognition.interimResults = config.interimResults ?? true;
        recognition.lang = config.lang ?? "fr-FR";
        recognition.maxAlternatives = config.maxAlternatives ?? 1;

        // Event handlers
        recognition.onstart = () => {
          setStatus("listening");
          setError(null);
          setTranscript("");
          setResult(null);
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const currentTranscript = finalTranscript || interimTranscript;
          setTranscript(currentTranscript);

          if (finalTranscript) {
            setStatus("processing");
            const confidence =
              event.results[event.results.length - 1][0].confidence;

            setResult({
              transcript: finalTranscript,
              confidence,
              isFinal: true,
            });
          }
        };

        recognition.onend = () => {
          setStatus("idle");
          recognitionRef.current = null;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };

        recognition.onerror = (event: any) => {
          setStatus("error");
          setError({
            code: "RECOGNITION_ERROR",
            message: `Speech recognition error: ${event.error}`,
          });
          recognitionRef.current = null;
        };

        recognition.start();

        // Set timeout to stop listening after 10 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 10000);
      } catch (err) {
        setStatus("error");
        setError({
          code: "RECOGNITION_ERROR",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
    [isSupported],
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const listenForNumber = useCallback(() => {
    startListening({
      continuous: false,
      interimResults: true,
      lang: "fr-FR",
      maxAlternatives: 3,
    });
  }, [startListening]);

  const getNumberFromTranscript = useCallback(
    (text?: string): number | null => {
      const textToConvert = text || transcript;
      if (!textToConvert) return null;

      return convertFrenchNumberToDigits(textToConvert);
    },
    [transcript, convertFrenchNumberToDigits],
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setTranscript("");
  }, []);

  return {
    status,
    error,
    isSupported,
    result,
    transcript,
    startListening,
    stopListening,
    listenForNumber,
    getNumberFromTranscript,
    clearResult,
    isListening: status === "listening",
    isProcessing: status === "processing",
    canListen: isSupported && status === "idle",
  };
}

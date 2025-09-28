export interface VoiceSettings {
  ttsEnabled: boolean;
  sttEnabled: boolean;
  autoReadQuestions: boolean;
  autoReadFeedback: boolean;
  speechRate: number; // 0.1 to 10
  speechPitch: number; // 0 to 2
  voiceLang: string; // 'fr-FR' by default
}

export interface SpeechSynthesisConfig {
  text: string;
  rate?: number;
  pitch?: number;
  lang?: string;
}

export interface SpeechRecognitionConfig {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export type SpeechRecognitionStatus =
  | "idle"
  | "listening"
  | "processing"
  | "error"
  | "not-supported";

export type SpeechSynthesisStatus =
  | "idle"
  | "speaking"
  | "paused"
  | "error"
  | "not-supported";

export interface VoiceError {
  code: string;
  message: string;
}

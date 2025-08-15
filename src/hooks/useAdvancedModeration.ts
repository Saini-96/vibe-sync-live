import { useState, useRef } from "react";

export interface ModerationResult {
  flagged: boolean;
  reason?: string;
  severity: number; // 1-3 (1: warning, 2: moderate violation, 3: severe violation)
  category?: 'profanity' | 'abuse' | 'threat' | 'personal_info' | 'spam';
}

interface ModerationState {
  warningCount: number;
  isBanned: boolean;
  banUntil: number | null;
  lastViolation: number | null;
}

// Enhanced bad words list including Hindi abusive words
const PROFANITY_WORDS = [
  // English profanity
  "fuck", "shit", "damn", "hell", "ass", "bitch", "bastard", "whore", "slut", 
  "piss", "crap", "dick", "cock", "pussy", "tits", "boobs", "nude", "sex",
  // Severe abuse
  "kill", "die", "murder", "suicide", "rape", "molest",
  // Hindi/Indian abusive words (transliterated)
  "chutiya", "madarchod", "behenchod", "bhenchod", "bhosdike", "randi", "saala", 
  "kutte", "kutta", "gandu", "harami", "kamina", "gadha", "ullu", "bewakoof",
  "chup", "bhak", "nikal", "mar", "maar"
];

const THREAT_PATTERNS = [
  /\b(kill|murder|die|suicide|hurt|harm|beat|fight)\b.*\b(you|u|yourself)\b/i,
  /\b(i|im|i'm)\s+(going|gonna|will)\s+(kill|murder|hurt|harm|beat)\b/i,
  /\b(die|kill yourself|kys|go die)\b/i
];

const PHONE_PATTERNS = [
  /\b\d{10}\b/, // 10 digit numbers
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // US format
  /\b\+\d{1,3}[-.\s]?\d{10,}\b/, // International format
  /\b\d{5}[-.\s]?\d{5}\b/ // Indian format
];

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[0-9]/g, (char) => {
      const leetMap: { [key: string]: string } = {
        '0': 'o', '1': 'i', '2': 'z', '3': 'e', '4': 'a', 
        '5': 's', '6': 'g', '7': 't', '8': 'b', '9': 'g'
      };
      return leetMap[char] || char;
    })
    .replace(/[@$!]/g, (char) => {
      const symbolMap: { [key: string]: string } = {
        '@': 'a', '$': 's', '!': 'i'
      };
      return symbolMap[char] || char;
    })
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function useAdvancedModeration() {
  const [moderationState, setModerationState] = useState<ModerationState>({
    warningCount: 0,
    isBanned: false,
    banUntil: null,
    lastViolation: null
  });

  const checkCache = useRef<Map<string, ModerationResult>>(new Map());

  const checkMessage = (message: string): ModerationResult => {
    const now = Date.now();
    
    // Check if user is currently banned
    if (moderationState.isBanned && moderationState.banUntil && now < moderationState.banUntil) {
      return {
        flagged: true,
        reason: `You are banned until ${new Date(moderationState.banUntil).toLocaleTimeString()}`,
        severity: 3,
        category: 'abuse'
      };
    }

    // Clear ban if expired
    if (moderationState.banUntil && now >= moderationState.banUntil) {
      setModerationState(prev => ({
        ...prev,
        isBanned: false,
        banUntil: null,
        warningCount: 0
      }));
    }

    // Check cache first
    const cached = checkCache.current.get(message);
    if (cached) return cached;

    const normalized = normalizeText(message);
    const original = message.trim();

    let result: ModerationResult = { flagged: false, severity: 0 };

    // 1. Check for profanity
    for (const word of PROFANITY_WORDS) {
      if (normalized.includes(word.toLowerCase())) {
        const inOriginal = new RegExp(`\\b${word}\\b`, 'i').test(original);
        result = {
          flagged: true,
          reason: `Inappropriate language detected: "${word}"`,
          severity: inOriginal ? 3 : 2,
          category: 'profanity'
        };
        break;
      }
    }

    // 2. Check for threats
    if (!result.flagged) {
      for (const pattern of THREAT_PATTERNS) {
        if (pattern.test(original)) {
          result = {
            flagged: true,
            reason: "Threatening language is not allowed",
            severity: 3,
            category: 'threat'
          };
          break;
        }
      }
    }

    // 3. Check for personal information
    if (!result.flagged) {
      if (PHONE_PATTERNS.some(pattern => pattern.test(original))) {
        result = {
          flagged: true,
          reason: "Please don't share phone numbers in chat",
          severity: 2,
          category: 'personal_info'
        };
      } else if (EMAIL_PATTERN.test(original)) {
        result = {
          flagged: true,
          reason: "Please don't share email addresses in chat",
          severity: 2,
          category: 'personal_info'
        };
      }
    }

    // 4. Check for spam (repeated characters or messages)
    if (!result.flagged) {
      const hasSpam = /(.)\1{4,}/.test(original) || // 5+ repeated characters
                     /^(.+)\1{2,}$/.test(original); // Repeated words/phrases
      if (hasSpam) {
        result = {
          flagged: true,
          reason: "Please avoid spam or excessive repetition",
          severity: 1,
          category: 'spam'
        };
      }
    }

    // Cache the result
    checkCache.current.set(message, result);
    
    // Clean cache if it gets too large
    if (checkCache.current.size > 100) {
      checkCache.current.clear();
    }

    // Handle escalation
    if (result.flagged) {
      setModerationState(prev => {
        const newWarningCount = prev.warningCount + 1;
        const shouldBan = newWarningCount >= 3 || result.severity >= 3;
        
        return {
          ...prev,
          warningCount: shouldBan ? 0 : newWarningCount,
          isBanned: shouldBan,
          banUntil: shouldBan ? now + (10 * 60 * 1000) : null, // 10 minute ban
          lastViolation: now
        };
      });

      // Update the result with escalation info
      if (moderationState.warningCount >= 2) {
        result.reason += ". Further violations will result in a temporary ban.";
      }
    }

    return result;
  };

  const resetModerationState = () => {
    setModerationState({
      warningCount: 0,
      isBanned: false,
      banUntil: null,
      lastViolation: null
    });
    checkCache.current.clear();
  };

  return {
    checkMessage,
    moderationState,
    resetModerationState
  };
}
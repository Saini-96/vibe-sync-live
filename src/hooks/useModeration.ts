import { useMemo, useRef } from "react";

// Lightweight client-side moderation with normalization to catch obfuscation
// Provides: check(message) => { flagged, reason, severity }
export type ModerationResult = {
  flagged: boolean;
  reason?: string;
  severity: number; // 1-3
};

const BAD_WORDS = [
  "abuse",
  "hate",
  "kill",
  "stupid",
  "idiot",
  "dumb",
  "bitch",
  "asshole",
  "fuck",
  "shit",
  "bastard",
  "slut",
  "whore",
  "nigger",
  "faggot",
];

const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "2": "z",
  "3": "e",
  "4": "a",
  "5": "s",
  "6": "g",
  "7": "t",
  "8": "b",
  "9": "g",
  "$": "s",
  "@": "a",
  "!": "i",
  "?": "",
};

function normalize(input: string) {
  const lower = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  // Replace leetspeak
  const mapped = lower
    .split("")
    .map((ch) => LEET_MAP[ch] ?? ch)
    .join("");
  // Remove spaces and punctuation, collapse repeats
  return mapped
    .replace(/[^a-z\d]+/g, "")
    .replace(/(.)\1{2,}/g, "$1$1");
}

export function useModeration() {
  const badPatterns = useMemo(() => {
    return BAD_WORDS.map((w) => new RegExp(`\\b${w}\\b`, "i"));
  }, []);

  const lastChecked = useRef<number>(0);

  function check(message: string): ModerationResult {
    const now = Date.now();
    lastChecked.current = now;
    const raw = message;
    const norm = normalize(raw);

    let worst: ModerationResult = { flagged: false, severity: 0 } as ModerationResult;

    for (const w of BAD_WORDS) {
      if (norm.includes(w)) {
        // severity heuristic: length and presence in raw too
        const inRaw = new RegExp(`\\b${w}\\b`, "i").test(raw);
        const severity = inRaw ? 3 : 2;
        worst = { flagged: true, reason: `Inappropriate language detected: ${w}`, severity };
        break;
      }
    }

    // Also run loose patterns
    if (!worst.flagged) {
      for (const p of badPatterns) {
        if (p.test(raw)) {
          worst = { flagged: true, reason: "Abusive language detected", severity: 2 };
          break;
        }
      }
    }

    return worst.flagged ? worst : { flagged: false, severity: 0 };
  }

  return { check };
}

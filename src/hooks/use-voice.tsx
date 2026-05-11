import { useCallback, useEffect, useState } from "react";

const KEY = "lc:voice";

function supported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function useVoice() {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      setEnabledState(v === "1");
    } catch { /* ignore */ }
  }, []);

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* ignore */ }
    if (!v && supported()) window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback((text: string) => {
    if (!enabled || !supported()) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "es-ES";
      u.rate = 0.95;
      u.pitch = 1.1;
      u.volume = 1;
      window.speechSynthesis.speak(u);
    } catch { /* ignore */ }
  }, [enabled]);

  return { enabled, setEnabled, speak, supported: supported() };
}

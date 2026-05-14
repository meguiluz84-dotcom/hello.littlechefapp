import { useCallback, useEffect, useState } from "react";

const KEY = "lc:challenge-mode";
const listeners = new Set<() => void>();

function read(): boolean {
  try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
}
function write(v: boolean) {
  try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* ignore */ }
  listeners.forEach((cb) => cb());
}

export function useChallengeMode() {
  const [enabled, setEnabled] = useState<boolean>(() => read());
  useEffect(() => {
    const cb = () => setEnabled(read());
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  const set = useCallback((v: boolean) => { write(v); setEnabled(v); }, []);
  const toggle = useCallback(() => set(!enabled), [enabled, set]);
  return { enabled, set, toggle };
}

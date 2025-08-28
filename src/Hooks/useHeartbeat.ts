// hooks/useHeartbeat.ts
import { useEffect } from "react";

export function useHeartbeat(intervalMs: number = 30_000) {
  useEffect(() => {
    const sendHeartbeat = async () => {
      await fetch("/api/heartbeat", { method: "POST" });
    };

    sendHeartbeat(); // immediately on mount
    const interval = setInterval(sendHeartbeat, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);
}

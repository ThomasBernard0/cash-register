import api from "./api";
import { useEffect, useState } from "react";
import type { Session } from "../types/session";

export const useActiveSession = () => {
  const [activeSession, setActiveSection] = useState<Session | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveSession = async () => {
    try {
      const res = await api.get<Session | string>("/sessions/active");
      setActiveSection(res.data === "" ? null : (res.data as Session));
    } catch (err: any) {
      console.error("Failed to fetch active session:", err);
      setError("Unable to fetch active session.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSession();
  }, []);

  return { activeSession, loading, error, refetch: fetchActiveSession };
};

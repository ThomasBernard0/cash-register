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

export const openSession = async (): Promise<Session> => {
  try {
    const res = await api.post<Session>("/sessions/open");
    return res.data;
  } catch (error: any) {
    console.error("Failed to open session:", error);
    throw new Error("Unable to open session.");
  }
};

export const closeActiveSession = async (): Promise<Session> => {
  try {
    const res = await api.patch<Session>("/sessions/close");
    return res.data;
  } catch (error: any) {
    console.log("Failed to close session:", error);
    console.error("Failed to close session:", error);
    throw new Error("Unable to close session.");
  }
};

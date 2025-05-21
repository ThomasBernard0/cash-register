import api from "./api";
import type { AccountSummary } from "../types/account";
import { useEffect, useState } from "react";

export const useAllAccounts = () => {
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get<AccountSummary[]>("/admin/accounts");
        setAccounts(res.data);
      } catch (err: any) {
        console.error("Failed to fetch accounts:", err);
        setError("Unable to fetch account list.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return { accounts, loading, error };
};

export const createAccount = async (
  name: string,
  password: string
): Promise<AccountSummary> => {
  try {
    const res = await api.post<AccountSummary>("/api/account", {
      name,
      password,
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to create account:", error);
    throw new Error("Unable to create account. It may already exist.");
  }
};

export const changeAccountPassword = async (
  id: number,
  password: string
): Promise<{ message: string }> => {
  try {
    const res = await api.put<{ message: string }>("/api/account/password", {
      id,
      password,
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to update password:", error);
    throw new Error("Unable to update password. Please try again.");
  }
};

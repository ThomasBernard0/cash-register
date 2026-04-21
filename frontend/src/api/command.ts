import type { OrderItem, Command } from "../types/command";
import api from "./api";

export const getCommandsBySession = async (sessionId: string): Promise<Command[]> => {
  const res = await api.get<Command[]>(`/commands/session/${sessionId}`);
  return res.data;
};

export const deleteCommand = async (id: number): Promise<void> => {
  await api.delete(`/commands/${id}`);
};

export const createCommand = async (items: OrderItem[]): Promise<string> => {
  try {
    const res = await api.post<{ message: string }>("/commands", { items });
    return res.data.message;
  } catch (error: any) {
    console.log("Failed to close session:", error);
    console.error("Failed to close session:", error);
    throw new Error("Unable to close session.");
  }
};

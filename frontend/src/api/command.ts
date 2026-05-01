import type { OrderItem, Command } from "../types/command";
import type { PaymentMethod } from "../constants/payment";
import api from "./api";

export const getCommandsBySession = async (sessionId: string): Promise<Command[]> => {
  const res = await api.get<Command[]>(`/commands/session/${sessionId}`);
  return res.data;
};

export const deleteCommand = async (id: number): Promise<void> => {
  await api.delete(`/commands/${id}`);
};

export const createCommand = async (items: OrderItem[], paymentMethod: PaymentMethod): Promise<string> => {
  try {
    const res = await api.post<{ message: string }>("/commands", { items, paymentMethod });
    return res.data.message;
  } catch (error: any) {
    console.error("Failed to create command:", error);
    throw new Error("Unable to create command.");
  }
};

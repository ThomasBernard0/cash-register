import type { OrderItem } from "../types/command";
import api from "./api";

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

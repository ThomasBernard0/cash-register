import { useCallback, useEffect, useRef, useState } from "react";
import api from "./api";
import type { Item, Section } from "../types/section";
import { debounce } from "@mui/material";

export const useSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await api.get<Section[]>("/sections");
      setSections(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const debouncedSaveOrder = useRef(
    debounce(async (orderedSections: Section[]) => {
      try {
        const payload = orderedSections.map((section) => ({
          id: section.id,
          items: section.items?.map((item) => ({
            id: item.id,
          })),
        }));

        await api.patch("/sections/reorder", payload);
      } catch (err) {
        console.error("Failed to save section order", err);
      }
    }, 800)
  ).current;

  const setLocalOrder = useCallback((newOrder: Section[]) => {
    setSections(newOrder);
  }, []);

  const reorderSections = useCallback(
    (newOrder: Section[]) => {
      setSections(newOrder);
      debouncedSaveOrder(newOrder);
    },
    [debouncedSaveOrder]
  );

  return {
    sections,
    loading,
    error,
    refetch: fetchSections,
    reorderSections,
    setLocalOrder,
  };
};

export const createSection = async (
  title: string,
  color: string
): Promise<Section> => {
  try {
    const res = await api.post<Section>("/sections", {
      title,
      color,
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to create account:", error);
    throw new Error("Unable to create account. It may already exist.");
  }
};

export const createItem = async (
  label: string,
  priceInCent: number,
  sectionId: string
): Promise<Item> => {
  try {
    const res = await api.post<Item>("/sections/items", {
      label,
      priceInCent,
      sectionId,
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to create account:", error);
    throw new Error("Unable to create account. It may already exist.");
  }
};

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
        await api.patch("/sections/reorder", {
          order: orderedSections.map((section, index) => ({
            id: section.id,
            order: index,
          })),
        });
      } catch (err) {
        console.error("Failed to save section order", err);
      }
    }, 800)
  ).current;

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

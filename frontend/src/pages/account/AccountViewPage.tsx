import React, { useState } from "react";
import SectionGrid from "../../components/account/viewMenu/SectionGrid";
import { useSections } from "../../api/section";
import { Box } from "@mui/material";
import type { Cart, Item } from "../../types/section";
import CartRecap from "../../components/account/viewMenu/Recap";

const AccountViewPage: React.FC = () => {
  const { sections, loading, error } = useSections();
  const [cart, setCart] = useState<Cart>(() => ({
    "section-001": {
      sectionLabel: "Boissons",
      items: {
        "item-a": {
          item: {
            id: "item-a",
            label: "Coca Cola",
            priceInCent: 250,
            sectionId: "section-001",
            order: 1,
          },
          quantity: 2,
        },
        "item-b": {
          item: {
            id: "item-b",
            label: "Fanta",
            priceInCent: 230,
            sectionId: "section-001",
            order: 2,
          },
          quantity: 1,
        },
      },
    },
    "section-002": {
      sectionLabel: "Snacks",
      items: {
        "item-c": {
          item: {
            id: "item-c",
            label: "Chips",
            priceInCent: 180,
            sectionId: "section-002",
            order: 1,
          },
          quantity: 3,
        },
      },
    },
  }));

  const addToCart = (sectionId: string, sectionLabel: string, item: Item) => {
    setCart((prev) => {
      const section = prev[sectionId] || { sectionLabel, items: {} };
      const existingItem = section.items[item.id];
      const updatedItem = {
        item,
        quantity: existingItem ? existingItem.quantity + 1 : 1,
      };
      return {
        ...prev,
        [sectionId]: {
          ...section,
          items: {
            ...section.items,
            [item.id]: updatedItem,
          },
        },
      };
    });
  };

  const removeFromCart = (sectionId: string, itemId: string) => {
    setCart((prev) => {
      const section = prev[sectionId];
      if (!section || !section.items[itemId]) return prev;
      const item = section.items[itemId];
      const newQty = item.quantity - 1;
      const newItems = { ...section.items };
      if (newQty <= 0) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = { ...item, quantity: newQty };
      }
      if (Object.keys(newItems).length === 0) {
        const { [sectionId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [sectionId]: {
          ...section,
          items: newItems,
        },
      };
    });
  };

  if (loading) {
    return <div>Loading sections...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          width: "80%",
          overflowY: "auto",
          p: 2,
        }}
      >
        <SectionGrid sections={sections} />
      </Box>
      <Box
        sx={{
          width: "20%",
          p: 2,
          bgcolor: "#e0e0e0",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <CartRecap cart={cart} />
      </Box>
    </Box>
  );
};

export default AccountViewPage;

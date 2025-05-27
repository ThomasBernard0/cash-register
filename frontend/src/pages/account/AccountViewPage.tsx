import React, { useState } from "react";
import SectionGrid from "../../components/account/viewMenu/SectionGrid";
import { useSections } from "../../api/section";
import { Box, Button } from "@mui/material";
import type { Cart, Item } from "../../types/section";
import CartRecap from "../../components/account/viewMenu/Recap";

const AccountViewPage: React.FC = () => {
  const { sections, loading, error } = useSections();
  const [cart, setCart] = useState<Cart>({
    "04bca5fe-8f27-420e-af4d-8619139b6cd1": {
      sectionLabel: "Nom de la section",
      items: {
        "e49abb2e-855b-4a04-8d1e-4bd267d87b4b": {
          item: {
            id: "e49abb2e-855b-4a04-8d1e-4bd267d87b4b",
            label: "Patate",
            priceInCent: 500,
            order: 1,
            sectionId: "04bca5fe-8f27-420e-af4d-8619139b6cd1",
          },
          quantity: 1,
        },
      },
    },
  });

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
        <SectionGrid sections={sections} cart={cart} />
      </Box>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "20%",
          bgcolor: "#e0e0e0",
          p: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mb: 2,
          }}
        >
          <CartRecap cart={cart} />
        </Box>
        <Button variant="contained" fullWidth>
          Valider
        </Button>
      </Box>
    </Box>
  );
};

export default AccountViewPage;

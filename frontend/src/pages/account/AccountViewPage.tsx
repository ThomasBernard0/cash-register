import React, { useState } from "react";
import SectionGrid from "../../components/account/viewMenu/SectionGrid";
import { useSections } from "../../api/section";
import { Box, CircularProgress } from "@mui/material";
import type { Item } from "../../types/section";
import type { Cart } from "../../types/command";
import CartRecap from "../../components/account/viewMenu/Recap";
import AccountNavbar from "../../components/account/AccountNavbar";

const AccountViewPage: React.FC = () => {
  const { sections, loading, error } = useSections();
  const [cart, setCart] = useState<Cart>({});

  const addToCart = (sectionId: string, sectionTitle: string, item: Item) => {
    setCart((prev) => {
      const section = prev[sectionId] || { sectionTitle, items: {} };
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

  const resetCart = () => {
    setCart({});
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  return (
    <>
      <AccountNavbar />
      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <Box
          sx={{
            width: "75%",
            overflowY: "auto",
            p: 2,
          }}
        >
          <SectionGrid
            sections={sections}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        </Box>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            height: "calc(100vh - 64px)",
            width: "25%",
            bgcolor: "#e0e0e0",
            p: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CartRecap cart={cart} resetCart={resetCart} />
        </Box>
      </Box>
    </>
  );
};

export default AccountViewPage;

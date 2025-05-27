import React from "react";
import SectionBlock from "./SectionBlock";
import { type Cart, type Item, type Section } from "../../../types/section";
import { Box } from "@mui/material";

type Props = {
  sections: Section[];
  cart: Cart;
  addToCart: (sectionId: string, sectionTitle: string, item: Item) => void;
  removeFromCart: (sectionId: string, itemId: string) => void;
};

const SectionGrid: React.FC<Props> = ({
  sections,
  cart,
  addToCart,
  removeFromCart,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      {sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          cartItems={
            cart[section.id]?.items
              ? Object.values(cart[section.id]?.items)
              : []
          }
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      ))}
    </Box>
  );
};

export default SectionGrid;

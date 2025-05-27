import React from "react";
import SectionBlock from "./SectionBlock";
import { type Cart, type Section } from "../../../types/section";
import { Box } from "@mui/material";

type Props = {
  sections: Section[];
  cart: Cart;
};

const SectionGrid: React.FC<Props> = ({ sections, cart }) => {
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
        />
      ))}
    </Box>
  );
};

export default SectionGrid;

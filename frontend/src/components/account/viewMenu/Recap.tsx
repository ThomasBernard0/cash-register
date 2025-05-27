import React from "react";
import { Box, Typography } from "@mui/material";
import { type Cart } from "../../../types/command";

const CartRecap: React.FC<{ cart: Cart }> = ({ cart }) => {
  const getCartTotalInCent = (cart: Cart): number => {
    return Object.values(cart).reduce((sectionAcc, section) => {
      const sectionTotal = Object.values(section.items).reduce(
        (itemAcc, { item, quantity }) => {
          return itemAcc + item.priceInCent * quantity;
        },
        0
      );
      return sectionAcc + sectionTotal;
    }, 0);
  };
  return (
    <Box sx={{ paddingRight: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Panier
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {(getCartTotalInCent(cart) / 100).toFixed(2)}€
        </Typography>
      </Box>
      {Object.entries(cart).map(([sectionId, section]) => (
        <Box key={sectionId} mb={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {section.sectionTitle}
          </Typography>
          {Object.values(section.items).map(({ item, quantity }) => (
            <Box
              key={item.id}
              display="flex"
              justifyContent="space-between"
              mt={1}
            >
              <Typography>{item.label}</Typography>
              <Typography>
                {quantity} x {(item.priceInCent / 100).toFixed(2)}€
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default CartRecap;

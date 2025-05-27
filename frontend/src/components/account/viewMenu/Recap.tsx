import React from "react";
import { Box, Typography } from "@mui/material";
import { type Cart } from "../../../types/section";

const CartRecap: React.FC<{ cart: Cart }> = ({ cart }) => {
  return (
    <Box sx={{ paddingRight: 1 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Panier
      </Typography>
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

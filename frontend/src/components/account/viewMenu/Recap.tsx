import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { type Cart, type OrderItem } from "../../../types/command";
import ConfirmPaymentModal from "./ConfirmPaymentModal";
import { createCommand } from "../../../api/command";

type Props = {
  cart: Cart;
  resetCart: () => void;
};

const CartRecap: React.FC<Props> = ({ cart, resetCart }) => {
  const [isConfirmPaymentModalOpen, setIsConfirmPaymentModalOpen] =
    useState<boolean>(false);

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

  const handleCloseModal = () => {
    setIsConfirmPaymentModalOpen(false);
  };

  const handleConfirm = async () => {
    const items: OrderItem[] = [];
    for (const sectionId in cart) {
      const section = cart[sectionId];
      for (const itemId in section.items) {
        const item = section.items[itemId];
        items.push({
          idItem: item.item.id,
          quantity: item.quantity,
        });
      }
    }
    await createCommand(items);
    resetCart();
    handleCloseModal();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            height: "100%",
            overflowY: "auto",
            paddingRight: 1,
          }}
        >
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
        <Box sx={{ flexShrink: 0, mt: 2 }}>
          <Button
            sx={{ height: "80px" }}
            variant="contained"
            fullWidth
            onClick={() => setIsConfirmPaymentModalOpen(true)}
          >
            Valider
          </Button>
        </Box>
      </Box>
      <ConfirmPaymentModal
        open={isConfirmPaymentModalOpen}
        priceInCent={getCartTotalInCent(cart)}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default CartRecap;

import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

type Props = {
  open: boolean;
  priceInCent: number;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmPaymentModal: React.FC<Props> = ({
  open,
  priceInCent,
  onClose,
  onConfirm,
}) => {
  const [given, setGiven] = useState<string>("");
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setGiven("");
    }
  }, [open]);

  const handleClick = (digit: string) => {
    if (digit === "." && (given === "" || given.includes("."))) return;
    else if (digit === "←") setGiven(given.slice(0, -1));
    else if (given.charAt(given.length - 3) === ".") return;
    else setGiven(given + digit);
    setPressedKey(digit);
    setTimeout(() => setPressedKey(null), 150);
  };

  const getChangeReturn = (priceInCent: number, given: string): string => {
    const givenInCent = parseFloat(given) * 100;
    const changeReturn = (givenInCent - priceInCent) / 100;
    return isNaN(changeReturn)
      ? (priceInCent / 100).toFixed(2)
      : changeReturn.toFixed(2);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: 24,
          width: { xs: "95%", sm: "70%", md: "40%" },
          height: "auto",
          maxHeight: "95vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Prix totale
          </Typography>
          <Typography variant="h6">
            {(priceInCent / 100).toFixed(2)}€
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Montant remis
            </Typography>
            <Typography variant="h6">{given !== "" ? given : "0"}€</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Rendu monnaie
            </Typography>
            <Typography variant="h6">
              {getChangeReturn(priceInCent, given)}€
            </Typography>
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "←"].map(
            (digit) => (
              <Button
                key={digit}
                variant="outlined"
                onClick={() => handleClick(digit)}
                sx={{
                  minHeight: { xs: 44, sm: 60 },
                  minWidth: { xs: 55, sm: 80 },
                  fontSize: { xs: "18px", sm: "24px" },
                  fontWeight: "bold",
                  padding: { xs: 1, sm: 2 },
                  bgcolor: pressedKey === digit ? "primary.main" : undefined,
                  color: pressedKey === digit ? "primary.contrastText" : undefined,
                  transition: "background-color 0.15s, color 0.15s",
                }}
              >
                {digit}
              </Button>
            )
          )}
        </Box>
        <Box sx={{ mt: "auto", pt: 2 }}>
          <Button variant="contained" fullWidth onClick={onConfirm}>
            Confirmer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmPaymentModal;

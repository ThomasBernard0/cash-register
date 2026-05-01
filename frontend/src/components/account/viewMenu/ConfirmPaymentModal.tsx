import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { CARD_FEE_RATE, type PaymentMethod } from "../../../constants/payment";

type Props = {
  open: boolean;
  basePriceInCent: number;
  onClose: () => void;
  onConfirm: (paymentMethod: PaymentMethod) => void;
};

const ConfirmPaymentModal: React.FC<Props> = ({
  open,
  basePriceInCent,
  onClose,
  onConfirm,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [given, setGiven] = useState<string>("");
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setGiven("");
      setPaymentMethod("cash");
    }
  }, [open]);

  const priceInCent =
    paymentMethod === "card"
      ? Math.ceil(basePriceInCent * (1 + CARD_FEE_RATE))
      : basePriceInCent;

  const handleClick = (digit: string) => {
    if (digit === "." && (given === "" || given.includes("."))) return;
    else if (digit === "←") setGiven(given.slice(0, -1));
    else if (given.charAt(given.length - 3) === ".") return;
    else setGiven(given + digit);
    setPressedKey(digit);
    setTimeout(() => setPressedKey(null), 150);
  };

  const getChangeReturn = (priceInCent: number, given: string): number => {
    const givenInCent = parseFloat(given) * 100;
    const changeReturn = (givenInCent - priceInCent) / 100;
    return isNaN(changeReturn) ? -priceInCent / 100 : changeReturn;
  };

  const changeReturn = getChangeReturn(priceInCent, given);
  const isInsufficient = paymentMethod === "cash" && changeReturn < 0;

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
          minHeight: { xs: 560, sm: 720 },
          maxHeight: "95vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <ToggleButtonGroup
          value={paymentMethod}
          exclusive
          onChange={(_, value) => {
            if (value) setPaymentMethod(value);
          }}
          fullWidth
          sx={{ height: { xs: 48, sm: 80 } }}
        >
          <ToggleButton value="cash">Espèces</ToggleButton>
          <ToggleButton value="card">Carte</ToggleButton>
        </ToggleButtonGroup>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Prix total
          </Typography>
          <Typography variant="h6">
            {(priceInCent / 100).toFixed(2)}€
          </Typography>
          {paymentMethod === "card" && (
            <Typography variant="caption" color="text.secondary">
              dont frais carte {(CARD_FEE_RATE * 100).toFixed(1)}% (
              {((priceInCent - basePriceInCent) / 100).toFixed(2)}€)
            </Typography>
          )}
        </Box>

        {paymentMethod === "cash" && (
          <>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
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
                <Typography variant="h6">
                  {given !== "" ? given : "0"}€
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Rendu monnaie
                </Typography>
                <Box
                  sx={{ height: "2rem", display: "flex", alignItems: "center" }}
                >
                  {isInsufficient ? (
                    <ErrorOutlineIcon
                      color="error"
                      sx={{ fontSize: "1.5rem" }}
                    />
                  ) : (
                    <Typography variant="h6">
                      {changeReturn.toFixed(2)}€
                    </Typography>
                  )}
                </Box>
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
                      bgcolor:
                        pressedKey === digit ? "primary.main" : undefined,
                      color:
                        pressedKey === digit
                          ? "primary.contrastText"
                          : undefined,
                      transition: "background-color 0.15s, color 0.15s",
                    }}
                  >
                    {digit}
                  </Button>
                ),
              )}
            </Box>
          </>
        )}

        <Box sx={{ width: "100%", mt: "auto", pt: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onConfirm(paymentMethod)}
            disabled={isInsufficient}
          >
            Confirmer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmPaymentModal;

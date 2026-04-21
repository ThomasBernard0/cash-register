import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { type Item } from "../../../types/section";
import { ChromePicker } from "react-color";

type Props = {
  open: boolean;
  item: Item | null;
  onClose: () => void;
  onEdit: (itemId: string, label: string, priceInCent: number, color: string) => void;
};

const EditItemModal: React.FC<Props> = ({ open, item, onClose, onEdit }) => {
  const [label, setLabel] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [color, setColor] = useState<string>("#FFFFFF");

  useEffect(() => {
    if (item) {
      setLabel(item.label);
      setPrice((item.priceInCent / 100).toFixed(2));
      setColor(item.color);
    } else {
      setLabel("");
      setPrice("");
      setColor("#FFFFFF");
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !isFormValid) return;
    const priceInCent = Math.round(parseFloat(price) * 100);
    onEdit(item.id, label, priceInCent, color);
    onClose();
  };

  const isFormValid = () => {
    return label.trim() !== "" && price.trim() !== "";
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" mb={2}>
          Modifier un item
        </Typography>
        <TextField
          label="Label"
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Prix (€)"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" mb={1}>
          Couleur
        </Typography>
        <ChromePicker
          color={color}
          onChangeComplete={(colorResult: { hex: string }) =>
            setColor(colorResult.hex)
          }
          disableAlpha
        />
        <Box sx={{ pt: 2, width: "100%" }}>
          <Button
            variant="contained"
            fullWidth
            disabled={!isFormValid()}
            type="submit"
          >
            Modifier
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditItemModal;

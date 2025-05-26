import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { type Item } from "../../../types/section";

type Props = {
  open: boolean;
  item: Item | null;
  onClose: () => void;
  onEdit: (itemId: string, label: string, priceInCent: number) => void;
};

const EditItemModal: React.FC<Props> = ({ open, item, onClose, onEdit }) => {
  const [label, setLabel] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    if (item) {
      setLabel(item.label);
      setPrice(item.priceInCent.toString());
    } else {
      setLabel("");
      setPrice("");
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !isFormValid) return;
    const priceInCent = Math.round(parseFloat(price) * 100);
    onEdit(item.id, label, priceInCent);
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
          height: "50%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" mb={2}>
          Modifier un item
        </Typography>
        <>
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
        </>
        <Box sx={{ mt: "auto", pt: 2 }}>
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

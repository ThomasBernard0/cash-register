import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
};

const EditItemModal: React.FC<Props> = ({ open, onClose, onEdit }) => {
  const [label, setLabel] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const isFormValid = () => {
    return label.trim() !== "" && price.trim() !== "";
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
          <Button variant="contained" fullWidth disabled={!isFormValid()}>
            Modifier
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditItemModal;

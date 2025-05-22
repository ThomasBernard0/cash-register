import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const COLORS = [
  "#F87171",
  "#FBBF24",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
];

type CreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreateSection: (data: { title: string; color: string }) => void;
  onCreateItem: (data: { label: string; priceInCent: number }) => void;
};

const AddSectionElementModal: React.FC<CreateModalProps> = ({
  open,
  onClose,
  onCreateSection,
  onCreateItem,
}) => {
  const [mode, setMode] = useState<"section" | "item">("section");

  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    if (mode === "section") {
      onCreateSection({ title, color });
    } else {
      const priceInCent = Math.round(parseFloat(price) * 100);
      if (isNaN(priceInCent)) return;
      onCreateItem({ label, priceInCent });
    }
    setTitle("");
    setColor(COLORS[0]);
    setLabel("");
    setPrice("");
    onClose();
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
          width: 400,
          height: "40%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" mb={2}>
          Ajouter une {mode === "section" ? "section" : "item"}
        </Typography>

        <ToggleButtonGroup
          fullWidth
          value={mode}
          exclusive
          onChange={(_, val) => val && setMode(val)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="section">Section</ToggleButton>
          <ToggleButton value="item">Item</ToggleButton>
        </ToggleButtonGroup>

        {mode === "section" ? (
          <>
            <TextField
              label="Titre"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" mb={1}>
              Couleur
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {COLORS.map((c) => (
                <Grid key={c}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: c,
                      borderRadius: "50%",
                      border:
                        color === c
                          ? "2px solid black"
                          : "2px solid transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => setColor(c)}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
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
        )}
        <Box sx={{ mt: "auto", pt: 2 }}>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Ajouter
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddSectionElementModal;

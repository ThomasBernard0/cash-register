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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import { useSections } from "../../api/section";

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

  const [title, setTitle] = useState<string>("");
  const [color, setColor] = useState<string>(COLORS[0]);

  const [sectionId, setSectionId] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const { sections } = useSections();

  const handleSectionChange = (event: SelectChangeEvent) => {
    setSectionId(event.target.value);
  };

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

  const isFormValid = () => {
    if (mode === "section") {
      return title.trim() !== "" && color.trim() !== "";
    } else {
      return (
        label.trim() !== "" && price.trim() !== "" && sectionId.trim() !== ""
      );
    }
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
          Ajouter {mode === "section" ? "une section" : "un item"}
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
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="section-select-label">Section</InputLabel>
              <Select
                labelId="section-select-label"
                value={sectionId}
                label="Section"
                onChange={handleSectionChange}
              >
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          <Button
            variant="contained"
            fullWidth
            disabled={!isFormValid()}
            onClick={handleSubmit}
          >
            Ajouter
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddSectionElementModal;

import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Grid } from "@mui/material";

const COLORS = [
  "#F87171",
  "#FBBF24",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
];

type Props = {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
};

const EditSectionModal: React.FC<Props> = ({ open, onClose, onEdit }) => {
  const [title, setTitle] = useState<string>("");
  const [color, setColor] = useState<string>(COLORS[0]);

  const isFormValid = () => {
    return title.trim() !== "" && color.trim() !== "";
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
          Modifier la section
        </Typography>
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
                      color === c ? "2px solid black" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setColor(c)}
                />
              </Grid>
            ))}
          </Grid>
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

export default EditSectionModal;

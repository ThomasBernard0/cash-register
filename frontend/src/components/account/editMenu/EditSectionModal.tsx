import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { type Section } from "../../../types/section";
import { ChromePicker } from "react-color";

type Props = {
  open: boolean;
  section: Section | null;
  onClose: () => void;
  onEdit: (sectionId: string, title: string, color: string) => void;
};

const EditSectionModal: React.FC<Props> = ({
  open,
  section,
  onClose,
  onEdit,
}) => {
  const [title, setTitle] = useState<string>("");
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setColor(section.color.toString());
    } else {
      setTitle("");
      setColor("");
    }
  }, [section]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!section || !isFormValid) return;
    onEdit(section.id, title, color);
    onClose();
  };

  const isFormValid = () => {
    return title.trim() !== "" && color.trim() !== "";
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
          alignItems: "center",
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
          <ChromePicker
            color={color}
            onChangeComplete={(colorResult: { hex: string }) =>
              setColor(colorResult.hex)
            }
            disableAlpha
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

export default EditSectionModal;

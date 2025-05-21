import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { changeAccountPassword } from "../../api/account";

interface EditPasswordModalProps {
  open: boolean;
  onClose: () => void;
  accountId: number | null;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({
  open,
  onClose,
  accountId,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!accountId || !password) {
      setError("Both accountId and password are required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await changeAccountPassword(accountId, password);
      setPassword("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        Modifier le mot de passe
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Mot de passe"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPasswordModal;

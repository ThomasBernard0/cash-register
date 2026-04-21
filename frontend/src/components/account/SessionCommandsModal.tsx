import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Session } from "../../types/session";
import type { Command } from "../../types/command";
import { getCommandsBySession, deleteCommand } from "../../api/command";
import { getFormattedDate } from "../../helpers/getFormattedDate";

type Props = {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  onCommandDeleted?: () => void;
};

const SessionCommandsModal = ({ open, onClose, session, onCommandDeleted }: Props) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commandToDelete, setCommandToDelete] = useState<Command | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCommands = () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    getCommandsBySession(session.id)
      .then(setCommands)
      .catch(() => setError("Impossible de charger les commandes."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!open || !session) return;
    fetchCommands();
  }, [open, session]);

  const handleConfirmDelete = async () => {
    if (!commandToDelete) return;
    setDeleting(true);
    try {
      await deleteCommand(commandToDelete.id);
      setCommandToDelete(null);
      fetchCommands();
      onCommandDeleted?.();
    } catch {
      setError("Impossible de supprimer la commande.");
      setCommandToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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
            width: "70%",
            maxHeight: "80vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Commandes de la session
          </Typography>

          {session && (
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              Ouverte le {getFormattedDate(session.createdAt)}
            </Typography>
          )}

          {loading && <CircularProgress sx={{ alignSelf: "center", my: 4 }} />}

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {!loading && !error && commands.length === 0 && (
            <Typography sx={{ color: "text.secondary" }}>
              Aucune commande pour cette session.
            </Typography>
          )}

          {!loading && !error && commands.length > 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Heure</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Articles</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {commands.map((cmd) => (
                  <TableRow key={cmd.id}>
                    <TableCell>{cmd.id}</TableCell>
                    <TableCell>{getFormattedDate(cmd.createdAt)}</TableCell>
                    <TableCell>
                      {(cmd.totalPriceInCent / 100).toFixed(2)} €
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cmd.status}
                        color={cmd.status === "validated" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {cmd.items.map((item) => (
                        <Typography key={item.id} variant="caption" display="block">
                          {item.quantity}× {item.label} ({(item.priceInCent / 100).toFixed(2)} €)
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setCommandToDelete(cmd)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Box sx={{ mt: "auto", pt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={onClose}>
              Fermer
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog open={!!commandToDelete} onClose={() => setCommandToDelete(null)}>
        <DialogTitle>Supprimer la commande</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Supprimer la commande #{commandToDelete?.id} ({((commandToDelete?.totalPriceInCent ?? 0) / 100).toFixed(2)} €) ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommandToDelete(null)} disabled={deleting}>
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={deleting}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionCommandsModal;

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
} from "@mui/material";
import type { Session } from "../../types/session";
import type { Command } from "../../types/command";
import { getCommandsBySession } from "../../api/command";
import { getFormattedDate } from "../../helpers/getFormattedDate";

type AggregatedItem = {
  label: string;
  quantity: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  session: Session | null;
};

const SessionSummaryModal = ({ open, onClose, session }: Props) => {
  const [aggregated, setAggregated] = useState<AggregatedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !session) return;
    setLoading(true);
    setError(null);
    getCommandsBySession(session.id)
      .then((commands: Command[]) => {
        const totals: Record<string, number> = {};
        for (const cmd of commands) {
          for (const item of cmd.items) {
            totals[item.label] = (totals[item.label] ?? 0) + item.quantity;
          }
        }
        const sorted = Object.entries(totals)
          .map(([label, quantity]) => ({ label, quantity }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setAggregated(sorted);
      })
      .catch(() => setError("Impossible de charger le récapitulatif."))
      .finally(() => setLoading(false));
  }, [open, session]);

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
          width: "40%",
          maxHeight: "80vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Récapitulatif de la session
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

        {!loading && !error && aggregated.length === 0 && (
          <Typography sx={{ color: "text.secondary" }}>
            Aucun article pour cette session.
          </Typography>
        )}

        {!loading && !error && aggregated.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Article</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Quantité
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aggregated.map((item) => (
                <TableRow key={item.label}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
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
  );
};

export default SessionSummaryModal;

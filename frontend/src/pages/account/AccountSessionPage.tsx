import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import AccountNavbar from "../../components/account/AccountNavbar";
import { useActiveSession, useClosedSessions } from "../../api/session";
import { openSession, closeActiveSession } from "../../api/session";
import { getFormattedDate } from "../../helpers/getFormattedDate";
import SessionCommandsModal from "../../components/account/SessionCommandsModal";
import SessionSummaryModal from "../../components/account/SessionSummaryModal";
import type { Session } from "../../types/session";

const AccountSessionPage = () => {
  const { activeSession, loading, error, refetch } = useActiveSession();
  const { sessions: closedSessions, refetch: refetchClosed } = useClosedSessions();

  const handleOpen = async () => {
    await openSession();
    await refetch();
  };

  const handleClose = async () => {
    await closeActiveSession();
    await refetch();
    await refetchClosed();
  };

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [commandsModalOpen, setCommandsModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const handleViewCommands = (session: Session) => {
    setSelectedSession(session);
    setCommandsModalOpen(true);
  };

  const handleCloseCommandsModal = () => {
    setCommandsModalOpen(false);
    setSelectedSession(null);
  };

  const handleViewSummary = (session: Session) => {
    setSelectedSession(session);
    setSummaryModalOpen(true);
  };

  const handleCloseSummaryModal = () => {
    setSummaryModalOpen(false);
    setSelectedSession(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <>
      <AccountNavbar />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "80%",
            mt: 6,
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
            Editer la session
          </Typography>

          <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography>
              {"Session en cours : "}
              {activeSession
                ? getFormattedDate(activeSession.createdAt)
                : "Non"}
            </Typography>
            {activeSession && (
              <Typography>
                {"Chiffre d'affaires : "}
                {(activeSession.totalRevenueInCent / 100).toFixed(2)} €
              </Typography>
            )}
          </Box>

          {!activeSession ? (
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Démarrer une session
            </Button>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
              <Button
                variant="outlined"
                onClick={() => handleViewCommands(activeSession)}
              >
                Voir les commandes
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleViewSummary(activeSession)}
              >
                Récapitulatif
              </Button>
              <Button variant="contained" color="primary" onClick={handleClose}>
                Clôturer la session
              </Button>
            </Box>
          )}

          {closedSessions.length > 0 && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Sessions passées
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Ouverture</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Fermeture</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Chiffre d'affaires
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Récapitulatif
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {closedSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{getFormattedDate(session.createdAt)}</TableCell>
                      <TableCell>
                        {session.closedAt ? getFormattedDate(session.closedAt) : "—"}
                      </TableCell>
                      <TableCell align="right">
                        {(session.totalRevenueInCent / 100).toFixed(2)} €
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewSummary(session)}
                        >
                          Récapitulatif
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Paper>
      </Box>
      <SessionCommandsModal
        open={commandsModalOpen}
        onClose={handleCloseCommandsModal}
        session={selectedSession}
      />
      <SessionSummaryModal
        open={summaryModalOpen}
        onClose={handleCloseSummaryModal}
        session={selectedSession}
      />
    </>
  );
};

export default AccountSessionPage;

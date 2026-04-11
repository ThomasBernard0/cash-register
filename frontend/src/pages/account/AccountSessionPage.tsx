import {
  Box,
  Typography,
  Button,
  Grid,
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
            width: "50%",
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

          <Grid container justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              disabled={!!activeSession}
            >
              Démarrer une session
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClose}
              disabled={!activeSession}
            >
              Clôturer la session
            </Button>
          </Grid>

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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default AccountSessionPage;

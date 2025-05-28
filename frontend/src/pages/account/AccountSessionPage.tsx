import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import AccountNavbar from "../../components/account/AccountNavbar";
import { useActiveSession } from "../../api/session";
import { openSession, closeActiveSession } from "../../api/session";

const AccountSessionPage = () => {
  const { activeSession, loading, error, refetch } = useActiveSession();

  const handleOpen = async () => {
    await openSession();
    await refetch();
  };

  const handleClose = async () => {
    await closeActiveSession();
    await refetch();
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
              Session en cours :{" "}
              {activeSession ? activeSession.createdAt.toString() : "Non"}
            </Typography>
            {activeSession && (
              <Typography>CA : {activeSession.totalRevenueInCent}</Typography>
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
        </Paper>
      </Box>
    </>
  );
};

export default AccountSessionPage;

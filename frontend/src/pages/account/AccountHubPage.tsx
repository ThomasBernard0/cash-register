import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useActiveSession } from "../../api/session";

const AccountHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeSession, loading, error } = useActiveSession();

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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 10 }}>
          Bienvenue sur votre espace
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Button
            variant="contained"
            size="large"
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/account/view")}
            disabled={!activeSession}
          >
            Voir le menu
          </Button>

          <Button
            variant="contained"
            size="large"
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/account/edit")}
          >
            Modifier le menu
          </Button>

          <Button
            variant="contained"
            size="large"
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/account/session")}
          >
            Modifier la session
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AccountHubPage;

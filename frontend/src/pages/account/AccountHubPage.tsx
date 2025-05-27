import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper } from "@mui/material";

const AccountHubPage: React.FC = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate("/account/view")}
          >
            Voir le menu
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/account/edit")}
          >
            Modifier le menu
          </Button>

          <Button
            variant="contained"
            size="large"
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

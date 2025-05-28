import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import AccountNavbar from "../../components/account/AccountNavbar";

const AccountSessionPage = () => {
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
            <Typography>Session en cours : </Typography>
            <Typography>CA : </Typography>
            <Typography>Label 3</Typography>
          </Box>

          <Grid container justifyContent="space-between">
            <Button variant="contained" color="primary">
              Bouton Gauche
            </Button>
            <Button variant="contained" color="primary">
              Bouton Droit
            </Button>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default AccountSessionPage;

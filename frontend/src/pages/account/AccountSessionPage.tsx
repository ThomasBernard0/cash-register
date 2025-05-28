import { Box, Typography, Button, Grid } from "@mui/material";
import AccountNavbar from "../../components/account/AccountNavbar";

const AccountSessionPage = () => {
  return (
    <>
      <AccountNavbar />
      <Box
        sx={{
          p: 4,
          maxWidth: 400,
          margin: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Mon Titre
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography>Label 1</Typography>
          <Typography>Label 2</Typography>
          <Typography>Label 3</Typography>
        </Box>

        <Grid container justifyContent="space-between">
          <Button variant="contained" color="primary">
            Bouton Gauche
          </Button>
          <Button variant="outlined" color="secondary">
            Bouton Droit
          </Button>
        </Grid>
      </Box>
    </>
  );
};

export default AccountSessionPage;

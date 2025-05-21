import React from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";

const accounts = [
  { id: 1, name: "Jean Dupont" },
  { id: 2, name: "Alice Martin" },
  { id: 3, name: "Marc Lemoine" },
];

const AdminDashboard: React.FC = () => {
  if (!accounts) return;
  const handleEditPassword = (id: number) => {
    console.log(`Modifier le mot de passe pour l'utilisateur ${id}`);
  };

  const handleCreateAccount = () => {
    console.log("Créer un nouveau compte");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateAccount}
        >
          Créer un compte
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.name}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    onClick={() => handleEditPassword(account.id)}
                  >
                    Modifier le mot de passe
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;

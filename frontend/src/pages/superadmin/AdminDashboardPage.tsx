import React, { useState } from "react";
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
import { useAllAccounts } from "../../api/account";
import CreateAccountModal from "../../components/superadmin/CreateAccountModale";

const AdminDashboard: React.FC = () => {
  const [createModale, setCreateModale] = useState(false);
  const { accounts, loading, error } = useAllAccounts();

  if (loading) {
    return <div>Loading accounts...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const handleEditPassword = (id: number) => {
    console.log(`Modifier le mot de passe pour l'utilisateur ${id}`);
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
          onClick={() => setCreateModale(true)}
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
      <CreateAccountModal
        open={createModale}
        onClose={() => setCreateModale(false)}
      />
    </Container>
  );
};

export default AdminDashboard;

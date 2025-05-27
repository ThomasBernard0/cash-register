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
  CircularProgress,
} from "@mui/material";
import { useAllAccounts } from "../../api/account";
import CreateAccountModal from "../../components/superadmin/CreateAccountModal";
import EditPasswordModal from "../../components/superadmin/EditPasswordModal";

const AdminDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const { accounts, loading, error, refetch } = useAllAccounts();

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

  const handleEditModalOpen = (id: number) => {
    setEditId(id);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditId(null);
    setIsEditModalOpen(false);
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
          onClick={() => setIsCreateModalOpen(true)}
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
                    onClick={() => handleEditModalOpen(account.id)}
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
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={refetch}
      />
      <EditPasswordModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        accountId={editId}
      />
    </Container>
  );
};

export default AdminDashboard;

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { postLogin } from "../api/auth";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await postLogin(username, password);
      const token = res.data.access_token;
      login(token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  useEffect(() => {
    if (authState.account) {
      if (authState.account.isSuperAdmin) {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    }
  }, [authState.account, navigate]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Connexion
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Nom de compte"
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Se connecter
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;

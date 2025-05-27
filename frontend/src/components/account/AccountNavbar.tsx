import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";

const AccountNavbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Button onClick={() => navigate("/account")} color="primary">
          ← Retour au Hub
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AccountNavbar;

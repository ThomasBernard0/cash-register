import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const AccountNavbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
          onClick={() => navigate("/account")}
        >
          <ArrowBackIosIcon />
          <Typography>Retour</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AccountNavbar;

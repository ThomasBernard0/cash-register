import { useNavigate } from "react-router-dom";

const AccountHubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Page Hub</h1>
      <button onClick={() => navigate("/account/view")}>
        Aller à Page View
      </button>
      <button onClick={() => navigate("/account/edit")}>
        Aller à Page Edit
      </button>
    </div>
  );
};

export default AccountHubPage;

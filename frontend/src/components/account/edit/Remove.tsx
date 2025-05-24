import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  onClick: () => void;
};

const Remove: React.FC<Props> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <ClearIcon />
    </Button>
  );
};

export default Remove;

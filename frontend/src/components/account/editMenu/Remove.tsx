import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  onClick: () => void;
  style?: React.CSSProperties;
};

const Remove: React.FC<Props> = ({ onClick, style }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick();
  };
  return (
    <Button style={{ ...style }} onClick={handleClick}>
      <ClearIcon />
    </Button>
  );
};

export default Remove;

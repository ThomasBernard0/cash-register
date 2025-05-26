import { Box, Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  absolute?: boolean;
};

const EditAction: React.FC<Props> = ({
  onEdit,
  onDelete,
  absolute = false,
}) => {
  const absoluteStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: 0,
  };

  return (
    <Box sx={{ display: "flex", ...(absolute ? absoluteStyle : {}) }}>
      <Button onClick={onEdit}>
        <EditIcon />
      </Button>
      <Button onClick={onDelete}>
        <ClearIcon />
      </Button>
    </Box>
  );
};

export default EditAction;

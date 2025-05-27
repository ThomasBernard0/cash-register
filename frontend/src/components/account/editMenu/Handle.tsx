import { Button } from "@mui/material";
import { forwardRef } from "react";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const Handle: React.FC = forwardRef<HTMLButtonElement>((props, ref) => {
  return (
    <Button ref={ref} style={{ cursor: "grab" }} {...props}>
      <DragHandleIcon sx={{ color: "black" }} />
    </Button>
  );
});

export default Handle;

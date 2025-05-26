import { useDroppable } from "@dnd-kit/core";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export function AddItemButton({ id, onClick }: any) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Button
      ref={setNodeRef}
      onClick={onClick}
      style={{
        cursor: "pointer",
        border: "dashed 1px black",
        height: "100px",
      }}
    >
      <AddIcon />
    </Button>
  );
}

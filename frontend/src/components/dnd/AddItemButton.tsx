import { useDroppable } from "@dnd-kit/core";

export function AddItemButton({ id, onClick }: any) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      style={{
        border: isOver ? "2px dashed #666" : "2px solid transparent",
        backgroundColor: isOver ? "#f0f0f0" : "transparent",
        padding: "8px 12px",
        borderRadius: 4,
        cursor: "pointer",
      }}
    >
      + Add item
    </button>
  );
}

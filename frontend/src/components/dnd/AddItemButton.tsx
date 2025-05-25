import { useDroppable } from "@dnd-kit/core";

export function AddItemButton({ id, onClick }: any) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      style={{
        border: "2px solid transparent",
        backgroundColor: "transparent",
        padding: "8px 12px",
        borderRadius: 4,
        cursor: "pointer",
      }}
    >
      + Add item
    </button>
  );
}

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import Item from "./Item";

type Props = {
  id: UniqueIdentifier;
  label: string;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const DraggableItem = ({ id, label, disabled, onEdit, onDelete }: Props) => {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({
      id,
    });
  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      label={label}
      onEdit={onEdit}
      onDelete={onDelete}
      dragging={isDragging}
      transition={transition}
      transform={transform}
      listeners={listeners}
    />
  );
};

export default DraggableItem;

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import Item from "./Item";

type Props = {
  id: UniqueIdentifier;
  label: string;
  disabled?: boolean;
  onRemove: () => void;
};

const DraggableItem = ({ id, label, disabled, onRemove }: Props) => {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({
      id,
    });
  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      label={label}
      onRemove={onRemove}
      dragging={isDragging}
      transition={transition}
      transform={transform}
      listeners={listeners}
    />
  );
};

export default DraggableItem;

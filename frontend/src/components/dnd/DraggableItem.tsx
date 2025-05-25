import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import Item from "./Item";

interface DraggableItemProps {
  id: UniqueIdentifier;
  label: string;
  index: number;
  disabled?: boolean;
}

const DraggableItem = ({ id, label, index, disabled }: DraggableItemProps) => {
  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    transform,
    transition,
  } = useSortable({
    id,
  });
  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={label}
      dragging={isDragging}
      sorting={isSorting}
      index={index}
      transition={transition}
      transform={transform}
      listeners={listeners}
    />
  );
};

export default DraggableItem;

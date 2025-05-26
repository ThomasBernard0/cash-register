import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import Item from "./Item";
import { type Item as ItemType } from "../../../types/section";

type Props = {
  id: UniqueIdentifier;
  item: ItemType;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const DraggableItem = ({ id, item, disabled, onEdit, onDelete }: Props) => {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({
      id,
    });
  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      item={item}
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

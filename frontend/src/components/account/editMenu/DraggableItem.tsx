import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import Item from "./Item";
import { type Item as ItemType } from "../../../types/section";

type Props = {
  id: UniqueIdentifier;
  item: ItemType;
  backgroundColor: string;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const DraggableItem = ({
  id,
  item,
  backgroundColor,
  disabled,
  onEdit,
  onDelete,
}: Props) => {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({
      id,
    });
  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      item={item}
      backgroundColor={backgroundColor}
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

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import Section from "./Section";

type Props = {
  id: UniqueIdentifier;
  title: string;
  items: UniqueIdentifier[];
  onRemove: () => void;
  children: React.ReactNode;
};

const DraggableSection = ({ id, title, items, onRemove, children }: Props) => {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: "container",
      children: items,
    },
  });
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== "container") ||
      items.includes(over.id)
    : false;

  return (
    <Section
      ref={setNodeRef}
      title={title}
      onRemove={onRemove}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      hover={isOverContainer}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
    >
      {children}
    </Section>
  );
};

export default DraggableSection;

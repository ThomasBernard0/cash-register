import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import Section from "./Section";
import { type Section as SectionType } from "../../../types/section";

type Props = {
  id: UniqueIdentifier;
  section?: SectionType;
  items: UniqueIdentifier[];
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
};

const DraggableSection = ({
  id,
  section,
  items,
  onEdit,
  onDelete,
  children,
}: Props) => {
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
      section={section}
      onEdit={onEdit}
      onDelete={onDelete}
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

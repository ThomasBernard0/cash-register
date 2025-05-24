import type { UniqueIdentifier } from "@dnd-kit/core";
import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import Section from "./Section";
import type { SectionProps } from "./Section";

const DraggableSection = ({
  children,
  disabled,
  id,
  items,
  style,
  ...props
}: SectionProps & {
  disabled?: boolean;
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  style?: React.CSSProperties;
}) => {
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
      ref={disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      hover={isOverContainer}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    >
      {children}
    </Section>
  );
};

export default DraggableSection;

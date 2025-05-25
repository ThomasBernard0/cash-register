import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  closestCenter,
  pointerWithin,
  rectIntersection,
  DndContext,
  DragOverlay,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import type {
  CollisionDetection,
  DropAnimation,
  UniqueIdentifier,
  KeyboardCoordinateGetter,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { multipleContainersCoordinateGetter } from "../../helpers/multipleContainersKeyboardCoordinates";

import Item from "./Item";
import DraggableSection from "./DraggableSection";
import Section from "./Section";
import DraggableItem from "./DraggableItem";
import { useSections } from "../../api/section";

import type { Section as SectionType } from "../../types/section";
import type { Item as ItemType } from "../../types/section";
import { AddItemButton } from "./AddItemButton";

export function MultipleSections() {
  const { sections, loading, error, reorderSections, setLocalOrder } =
    useSections();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewSection = useRef(false);
  const coordinateGetter: KeyboardCoordinateGetter =
    multipleContainersCoordinateGetter;

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && sections.some((section) => section.id === activeId)) {
        return rectIntersection({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) =>
              (container.id !== activeId &&
                sections.some((section) => section.id === container.id)) ||
              (typeof container.id === "string" &&
                container.id.endsWith("-placeholder"))
          ),
        });
      }
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId: UniqueIdentifier | null = getFirstCollision(
        intersections,
        "id"
      );
      if (overId != null) {
        if (typeof overId === "string") {
          if (overId.endsWith("-placeholder")) {
            const sectionId = overId.replace("-placeholder", "");
            const section = sections.find((s) => s.id === sectionId);
            if (section) {
              lastOverId.current = overId;
              return [{ id: overId }];
            }
          } else if (sections.some((s) => s.id === overId)) {
            const section = sections.find((s) => s.id === overId);
            if (section && section.items.length > 0) {
              const closestItemId = closestCenter({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                  (container) =>
                    container.id !== overId &&
                    section.items.some((item) => item.id === container.id)
                ),
              })[0]?.id;
              if (closestItemId) {
                lastOverId.current = closestItemId;
                return [{ id: closestItemId }];
              }
            }
          }
        }
        lastOverId.current = overId;
        return [{ id: overId }];
      }
      if (recentlyMovedToNewSection.current) {
        lastOverId.current = activeId;
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, sections]
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const onDragCancel = () => {
    setActiveId(null);
  };

  const onDragStart = ({ active }: any) => {
    setActiveId(active.id);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return;
    const isPlaceholder = (over.id as string).endsWith("-placeholder");
    const targetSectionId = isPlaceholder
      ? (over.id as string).replace("-placeholder", "")
      : null;
    const activeSection = sections.find((section) =>
      section.items.some((item) => item.id === active.id)
    );
    const overSection = isPlaceholder
      ? sections.find((section) => section.id === targetSectionId)
      : sections.find((section) =>
          section.items.some((item) => item.id === over.id)
        );
    if (!activeSection || !overSection) {
      return;
    }
    const activeItem = activeSection.items.find(
      (item) => item.id === active.id
    );
    if (!activeItem) return;
    const overIndex = isPlaceholder
      ? overSection.items.length
      : overSection.items.findIndex((item) => item.id === over.id);
    const insertIndex = overIndex === -1 ? overSection.items.length : overIndex;
    if (activeSection.id === overSection.id) {
      const items = [...activeSection.items];
      const fromIndex = items.findIndex((item) => item.id === active.id);
      items.splice(fromIndex, 1);
      let adjustedIndex = insertIndex;
      if (fromIndex < insertIndex) {
        adjustedIndex = insertIndex - 1;
      }
      items.splice(adjustedIndex, 0, activeItem);
      const updatedSections = sections.map((section) =>
        section.id === activeSection.id ? { ...section, items } : section
      );
      setLocalOrder(updatedSections);
    } else {
      const updatedSections = sections.map((section) => {
        if (section.id === activeSection.id) {
          return {
            ...section,
            items: section.items.filter((item) => item.id !== active.id),
          };
        }
        if (section.id === overSection.id) {
          return {
            ...section,
            items: [
              ...section.items.slice(0, insertIndex),
              activeItem,
              ...section.items.slice(insertIndex),
            ],
          };
        }
        return section;
      });
      setLocalOrder(updatedSections);
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }
    const activeSectionIndex = sections.findIndex(
      (section) => section.id === active.id
    );
    const overSectionIndex = sections.findIndex(
      (section) => section.id === over.id
    );
    if (activeSectionIndex !== -1 && overSectionIndex !== -1) {
      const newSections = [...sections];
      const [movedSection] = newSections.splice(activeSectionIndex, 1);
      newSections.splice(overSectionIndex, 0, movedSection);
      reorderSections(newSections);
      setActiveId(null);
      return;
    }
    const activeSection = sections.find((section) =>
      section.items.some((item) => item.id === active.id)
    );
    const overSection = sections.find((section) =>
      section.items.some((item) => item.id === over.id)
    );
    if (!activeSection || !overSection) {
      setActiveId(null);
      return;
    }
    const activeItemIndex = activeSection.items.findIndex(
      (item) => item.id === active.id
    );
    const overItemIndex = overSection.items.findIndex(
      (item) => item.id === over.id
    );
    let newSections = [...sections];
    if (activeSection.id === overSection.id) {
      const newItems = [...activeSection.items];
      const [movedItem] = newItems.splice(activeItemIndex, 1);
      newItems.splice(overItemIndex, 0, movedItem);
      newSections = newSections.map((section) =>
        section.id === activeSection.id
          ? { ...section, items: newItems }
          : section
      );
    } else {
      const activeItems = [...activeSection.items];
      const [movedItem] = activeItems.splice(activeItemIndex, 1);
      const overItems = [...overSection.items];
      overItems.splice(overItemIndex, 0, movedItem);
      newSections = newSections.map((section) => {
        if (section.id === activeSection.id)
          return { ...section, items: activeItems };
        if (section.id === overSection.id)
          return { ...section, items: overItems };
        return section;
      });
    }
    reorderSections(newSections);
    setActiveId(null);
  };

  const renderSectionDragOverlay = (section: SectionType) => (
    <Section label={section.title} shadow style={{ height: "100%" }}>
      {section.items.map((item) => (
        <Item key={item.id} value={item.label} />
      ))}
    </Section>
  );

  const renderSortableItemDragOverlay = (item: ItemType) => (
    <Item value={item.label} dragOverlay />
  );

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewSection.current = false;
    });
  }, [sections]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div
        style={{
          display: "inline-grid",
          boxSizing: "border-box",
          padding: 20,
          gridAutoFlow: "row",
        }}
      >
        <SortableContext
          items={sections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <DraggableSection
              key={section.id}
              id={section.id}
              label={section.title}
              items={section.items.map((item) => item.id)}
              onRemove={() => {
                return;
              }}
            >
              <SortableContext
                items={section.items.map((item) => item.id)}
                strategy={rectSortingStrategy}
              >
                {section.items.map((item, index) => (
                  <DraggableItem
                    key={item.id}
                    label={item.label}
                    id={item.id}
                    index={index}
                  />
                ))}
                <AddItemButton
                  id={`${section.id}-placeholder`}
                  onClick={() => {
                    return;
                  }}
                />
              </SortableContext>
            </DraggableSection>
          ))}

          {
            <button
              onClick={() => {
                return;
              }}
            >
              + Add column
            </button>
          }
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId
            ? sections.some((section) => section.id === activeId)
              ? renderSectionDragOverlay(
                  sections.find((section) => section.id === activeId)!
                )
              : (() => {
                  const activeItem = sections
                    .flatMap((s) => s.items)
                    .find((item) => item.id === activeId);
                  if (!activeItem) return null;
                  return renderSortableItemDragOverlay(activeItem);
                })()
            : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

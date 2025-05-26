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
  arrayMove,
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
  const initialContainer = useRef<UniqueIdentifier | undefined>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewSection = useRef(false);
  const coordinateGetter: KeyboardCoordinateGetter =
    multipleContainersCoordinateGetter;

  const idInSections = (id: UniqueIdentifier): boolean => {
    return sections.some((section) => section.id === id);
  };

  const findElement = (id: UniqueIdentifier) => {
    if (typeof id === "string" && id.endsWith("-placeholder")) {
      return id.replace("-placeholder", "");
    }

    if (sections.some((section) => section.id === id)) {
      return id;
    }

    for (const section of sections) {
      if (section.items.some((item) => item.id === id)) {
        return section.id;
      }
    }
  };

  const getItemsBySectionId = (id: UniqueIdentifier): any[] => {
    const items = sections.find((section) => section.id == id)?.items;
    return items ? items : [];
  };

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && idInSections(activeId)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            idInSections(container.id)
          ),
        });
      }
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");
      if (overId != null) {
        if (idInSections(overId)) {
          const containerItems = sections.find(
            (section) => section.id == overId
          )?.items;
          if (!containerItems) return [];
          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.some((item) => item.id == container.id)
              ),
            })[0]?.id;
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
    initialContainer.current = findElement(active.id);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id;
    if (overId == null || idInSections(active.id)) {
      return;
    }
    const overContainer = findElement(overId);
    const activeContainer = findElement(active.id);
    if (!overContainer || !activeContainer) {
      return;
    }
    const activeIndex = getItemsBySectionId(activeContainer).findIndex(
      (item) => item.id === active.id
    );
    let overIndex = getItemsBySectionId(overContainer).findIndex(
      (item) => item.id === overId
    );
    if (overId.toString().endsWith("-placeholder")) {
      overIndex = getItemsBySectionId(overContainer).length;
    }
    if (activeContainer !== overContainer) {
      recentlyMovedToNewSection.current = true;
      const itemToMove = getItemsBySectionId(activeContainer)[activeIndex];
      if (!itemToMove) return;

      const newSections = sections.map((section) => {
        if (section.id === activeContainer) {
          return {
            ...section,
            items: section.items.filter((item) => item.id !== active.id),
          };
        }
        if (section.id === overContainer) {
          const newItems = [...section.items];
          newItems.splice(overIndex, 0, itemToMove);
          return {
            ...section,
            items: newItems,
          };
        }
        return section;
      });
      setLocalOrder(newSections);
      return;
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (idInSections(active.id) && over?.id) {
      const newSections = (() => {
        const activeIndex = sections.findIndex(
          (section) => section.id === active.id
        );
        const overIndex = sections.findIndex(
          (section) => section.id === over.id
        );
        if (activeIndex === -1 || overIndex === -1) return sections;

        return arrayMove(sections, activeIndex, overIndex);
      })();
      setLocalOrder(newSections);
      return;
    }
    const activeContainer = findElement(active.id);
    if (!activeContainer) {
      setActiveId(null);
      return;
    }
    const overId = over?.id;
    if (overId == null) {
      setActiveId(null);
      return;
    }
    const overContainer = findElement(overId);
    if (overContainer) {
      const activeIndex = getItemsBySectionId(activeContainer).findIndex(
        (item) => item.id == active.id
      );
      const overIndex = overId.toString().endsWith("-placeholder")
        ? getItemsBySectionId(overContainer).length
        : getItemsBySectionId(overContainer).findIndex(
            (item) => item.id == overId
          );
      if (
        activeIndex !== overIndex ||
        initialContainer.current !== overContainer
      ) {
        const newSections = sections.map((section: SectionType) => {
          if (section.id == overContainer) {
            return {
              ...section,
              items: arrayMove(section.items, activeIndex, overIndex),
            };
          }
          return { ...section };
        });
        setLocalOrder(newSections);
      }
    }
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

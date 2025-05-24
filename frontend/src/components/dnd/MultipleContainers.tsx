import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal, unstable_batchedUpdates } from "react-dom";
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
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { multipleContainersCoordinateGetter } from "../../helpers/multipleContainersKeyboardCoordinates";

import Item from "./Item";
import DraggableSection from "./DraggableSection";
import Section from "./Section";
import DraggableItem from "./DraggableItem";

const TESTVALUE = {
  A: createRange(3, "A"),
  B: createRange(5, "B"),
  C: createRange(9, "C"),
  D: createRange(3, "D"),
};
export function createRange(length: number, el: string) {
  return [...new Array(length)].map((_, index) => el + index);
}

console.log(TESTVALUE);

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

export function MultipleSections() {
  const [sections, setSections] = useState<Items>(TESTVALUE);
  const [sectionsId, setSectionsId] = useState(
    Object.keys(sections) as UniqueIdentifier[]
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewSection = useRef(false);
  const coordinateGetter: KeyboardCoordinateGetter =
    multipleContainersCoordinateGetter;

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in sections) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in sections
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
        if (overId in sections) {
          const containerItems = sections[overId];
          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
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

  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const findSection = (id: UniqueIdentifier) => {
    if (id in sections) {
      return id;
    }
    return Object.keys(sections).find((key) => sections[key].includes(id));
  };

  const onDragCancel = () => {
    if (clonedItems) {
      setSections(clonedItems);
    }
    setActiveId(null);
    setClonedItems(null);
  };

  const onDragStart = ({ active }: any) => {
    setActiveId(active.id);
    setClonedItems(sections);
  };

  const onDragOver = ({ active, over }: any) => {
    const overId = over?.id;
    if (overId == null || active.id in sections) {
      return;
    }
    const overSection = findSection(overId);
    const activeSection = findSection(active.id);
    if (!overSection || !activeSection) {
      return;
    }
    if (activeSection !== overSection) {
      setSections((sections) => {
        const activeItems = sections[activeSection];
        const overItems = sections[overSection];
        const overIndex = overItems.indexOf(overId);
        const activeIndex = activeItems.indexOf(active.id);
        let newIndex: number;
        if (overId in sections) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }
        recentlyMovedToNewSection.current = true;
        return {
          ...sections,
          [activeSection]: sections[activeSection].filter(
            (item) => item !== active.id
          ),
          [overSection]: [
            ...sections[overSection].slice(0, newIndex),
            sections[activeSection][activeIndex],
            ...sections[overSection].slice(
              newIndex,
              sections[overSection].length
            ),
          ],
        };
      });
    }
  };

  const onDragEnd = ({ active, over }: any) => {
    if (active.id in sections && over?.id) {
      setSectionsId((sectionsId) => {
        const activeIndex = sectionsId.indexOf(active.id);
        const overIndex = sectionsId.indexOf(over.id);
        return arrayMove(sectionsId, activeIndex, overIndex);
      });
    }
    const activeSection = findSection(active.id);
    if (!activeSection) {
      setActiveId(null);
      return;
    }
    const overId = over?.id;
    if (overId == null) {
      setActiveId(null);
      return;
    }
    const overSection = findSection(overId);
    if (overSection) {
      const activeIndex = sections[activeSection].indexOf(active.id);
      const overIndex = sections[overSection].indexOf(overId);
      if (activeIndex !== overIndex) {
        setSections((sections) => ({
          ...sections,
          [overSection]: arrayMove(
            sections[overSection],
            activeIndex,
            overIndex
          ),
        }));
      }
    }
    setActiveId(null);
  };

  const renderSectionDragOverlay = (
    sectionId: UniqueIdentifier,
    sections: Items
  ) => {
    return (
      <Section
        label={`Column ${sectionId}`}
        style={{
          height: "100%",
        }}
        shadow
        unstyled={false}
      >
        {sections[sectionId].map((item) => (
          <Item key={item} value={item} />
        ))}
      </Section>
    );
  };
  const renderSortableItemDragOverlay = (id: UniqueIdentifier) => {
    return <Item value={id} dragOverlay />;
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  function handleRemove(sectionId: UniqueIdentifier) {
    setSectionsId((sectionsId) => sectionsId.filter((id) => id !== sectionId));
  }

  function handleAddColumn() {
    const newSectionId = "A";

    unstable_batchedUpdates(() => {
      setSectionsId((sectionsId) => [...sectionsId, newSectionId]);
      setSections((sections) => ({
        ...sections,
        [newSectionId]: [],
      }));
    });
  }

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
          items={[...sectionsId]}
          strategy={verticalListSortingStrategy}
        >
          {sectionsId.map((sectionId) => (
            <DraggableSection
              key={sectionId}
              id={sectionId}
              label={`Column ${sectionId}`}
              items={sections[sectionId]}
              onRemove={() => handleRemove(sectionId)}
            >
              <SortableContext
                items={sections[sectionId]}
                strategy={rectSortingStrategy}
              >
                {sections[sectionId].map((value, index) => {
                  return (
                    <DraggableItem
                      disabled={
                        activeId != null ? sectionsId.includes(activeId) : false
                      }
                      key={value}
                      id={value}
                      index={index}
                    />
                  );
                })}
                {
                  <button
                    onClick={() => {
                      return;
                    }}
                  >
                    +
                  </button>
                }
              </SortableContext>
            </DraggableSection>
          ))}
          {<button onClick={handleAddColumn}>+ Add column</button>}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId
            ? sectionsId.includes(activeId)
              ? renderSectionDragOverlay(activeId, sections)
              : renderSortableItemDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

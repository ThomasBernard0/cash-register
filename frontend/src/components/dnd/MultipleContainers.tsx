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

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

const renderContainerDragOverlay = (
  containerId: UniqueIdentifier,
  items: Items
) => {
  return (
    <Section
      label={`Column ${containerId}`}
      style={{
        height: "100%",
      }}
      shadow
      unstyled={false}
    >
      {items[containerId].map((item) => (
        <Item key={item} value={item} />
      ))}
    </Section>
  );
};
const renderSortableItemDragOverlay = (id: UniqueIdentifier) => {
  return <Item value={id} dragOverlay />;
};

export function MultipleContainers() {
  const [items, setItems] = useState<Items>(TESTVALUE);
  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[]
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const coordinateGetter: KeyboardCoordinateGetter =
    multipleContainersCoordinateGetter;
  const isSortingContainer =
    activeId != null ? containers.includes(activeId) : false;

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
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
        if (overId in items) {
          const containerItems = items[overId];
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
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );

  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const onDragCancel = () => {
    if (clonedItems) {
      setItems(clonedItems);
    }
    setActiveId(null);
    setClonedItems(null);
  };

  const onDragStart = ({ active }: any) => {
    setActiveId(active.id);
    setClonedItems(items);
  };

  const onDragOver = ({ active, over }: any) => {
    const overId = over?.id;
    if (overId == null || active.id in items) {
      return;
    }
    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);
    if (!overContainer || !activeContainer) {
      return;
    }
    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer];
        const overItems = items[overContainer];
        const overIndex = overItems.indexOf(overId);
        const activeIndex = activeItems.indexOf(active.id);
        let newIndex: number;
        if (overId in items) {
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
        recentlyMovedToNewContainer.current = true;
        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item !== active.id
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(
              newIndex,
              items[overContainer].length
            ),
          ],
        };
      });
    }
  };

  const onDragEnd = ({ active, over }: any) => {
    if (active.id in items && over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id);
        const overIndex = containers.indexOf(over.id);
        return arrayMove(containers, activeIndex, overIndex);
      });
    }
    const activeContainer = findContainer(active.id);
    if (!activeContainer) {
      setActiveId(null);
      return;
    }
    const overId = over?.id;
    if (overId == null) {
      setActiveId(null);
      return;
    }
    const overContainer = findContainer(overId);
    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(overId);
      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }
    setActiveId(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

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
          items={[...containers]}
          strategy={verticalListSortingStrategy}
        >
          {containers.map((containerId) => (
            <DraggableSection
              key={containerId}
              id={containerId}
              label={`Column ${containerId}`}
              items={items[containerId]}
              onRemove={() => handleRemove(containerId)}
            >
              <SortableContext
                items={items[containerId]}
                strategy={rectSortingStrategy}
              >
                {items[containerId].map((value, index) => {
                  return (
                    <DraggableItem
                      disabled={isSortingContainer}
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
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId, items)
              : renderSortableItemDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );

  function handleRemove(containerID: UniqueIdentifier) {
    setContainers((containers) =>
      containers.filter((id) => id !== containerID)
    );
  }

  function handleAddColumn() {
    const newContainerId = getNextContainerId();

    unstable_batchedUpdates(() => {
      setContainers((containers) => [...containers, newContainerId]);
      setItems((items) => ({
        ...items,
        [newContainerId]: [],
      }));
    });
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  }
}

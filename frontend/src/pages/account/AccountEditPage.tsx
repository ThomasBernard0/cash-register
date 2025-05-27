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
  type CollisionDetection,
  type DropAnimation,
  type UniqueIdentifier,
  type KeyboardCoordinateGetter,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { multipleContainersCoordinateGetter } from "../../helpers/multipleContainersKeyboardCoordinates";
import { useSections } from "../../api/section";

import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DraggableSection from "../../components/account/editMenu/DraggableSection";
import Section from "../../components/account/editMenu/Section";
import DraggableItem from "../../components/account/editMenu/DraggableItem";
import Item from "../../components/account/editMenu/Item";
import AddItemButton from "../../components/account/editMenu/AddItemButton";

import { type Section as SectionType } from "../../types/section";
import { type Item as ItemType } from "../../types/section";
import EditItemModal from "../../components/account/editMenu/EditItemModal";
import EditSectionModal from "../../components/account/editMenu/EditSectionModal";

const AccountEditPage: React.FC = () => {
  const {
    sections,
    loading,
    error,
    reorderSections,
    setLocalOrder,
    createSection,
    editSection,
    deleteSection,
    createItem,
    editItem,
    deleteItem,
  } = useSections();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const initialContainer = useRef<UniqueIdentifier | undefined>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewSection = useRef(false);
  const coordinateGetter: KeyboardCoordinateGetter =
    multipleContainersCoordinateGetter;

  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionType | null>(
    null
  );
  const [editingItem, setEditingItem] = useState<ItemType | null>(null);

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
      reorderSections(newSections);
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
        reorderSections(newSections);
      }
    }
    setActiveId(null);
  };

  const renderSectionDragOverlay = (section: SectionType) => (
    <Section section={section}>
      {section.items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </Section>
  );

  const renderSortableItemDragOverlay = (item: ItemType) => (
    <Item item={item} dragOverlay />
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

  if (loading) {
    return <div>Loading sections...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            p: 1,
            gap: 1,
            width: "100%",
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
                section={section}
                items={section.items.map((item) => item.id)}
                onEdit={() => {
                  setEditingSection(section);
                  setIsEditSectionModalOpen(true);
                }}
                onDelete={() => deleteSection(section.id)}
              >
                <SortableContext
                  items={section.items.map((item) => item.id)}
                  strategy={rectSortingStrategy}
                >
                  {section.items.map((item) => (
                    <DraggableItem
                      key={item.id}
                      id={item.id}
                      item={item}
                      backgroundColor={section.color}
                      onEdit={() => {
                        setEditingItem(item);
                        setIsEditItemModalOpen(true);
                      }}
                      onDelete={() => {
                        deleteItem(item.id);
                      }}
                    />
                  ))}
                  <AddItemButton
                    id={`${section.id}-placeholder`}
                    onClick={() => createItem(section.id)}
                  />
                </SortableContext>
              </DraggableSection>
            ))}

            {
              <Button
                onClick={createSection}
                style={{
                  cursor: "pointer",
                  border: "dashed 1px black",
                }}
              >
                <AddIcon sx={{ color: "black" }} />
              </Button>
            }
          </SortableContext>
        </Box>
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
      <EditSectionModal
        open={isEditSectionModalOpen}
        section={editingSection}
        onClose={() => {
          setIsEditSectionModalOpen(false);
        }}
        onEdit={editSection}
      />
      <EditItemModal
        open={isEditItemModalOpen}
        item={editingItem}
        onClose={() => {
          setIsEditItemModalOpen(false);
        }}
        onEdit={editItem}
      />
    </>
  );
};

export default AccountEditPage;

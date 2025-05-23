import React, { useState } from "react";
import SectionGrid from "../../components/account/SectionGrid";
import { useSections } from "../../api/section";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddSectionElementModal from "../../components/account/AddSectionElementModal";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const AccountEditPage: React.FC = () => {
  const { sections, loading, error, refetch, reorderSections } = useSections();
  const [isAddElementModalOpen, setIsAddElementModalOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(sections, oldIndex, newIndex);

    reorderSections(newOrder);
  };

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
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SectionGrid sections={sections} />
      </DndContext>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setIsAddElementModalOpen(true)}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      <AddSectionElementModal
        open={isAddElementModalOpen}
        onClose={() => {
          setIsAddElementModalOpen(false);
        }}
        onCreated={refetch}
      />
    </>
  );
};

export default AccountEditPage;

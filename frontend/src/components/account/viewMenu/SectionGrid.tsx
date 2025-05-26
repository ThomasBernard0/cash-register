import React from "react";
import SectionBlock from "./SectionBlock";
import type { Section } from "../../../types/section";
import { Box } from "@mui/material";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type SectionGridProps = {
  sections: Section[];
  draggable?: boolean;
};

const SectionGrid: React.FC<SectionGridProps> = ({
  sections,
  draggable = false,
}) => {
  if (!draggable) {
    return (
      <Box sx={{ p: 2 }}>
        {sections.map((section) => (
          <SectionBlock
            key={section.id}
            id={section.id}
            title={section.title}
            items={section.items}
            draggable={false}
          />
        ))}
      </Box>
    );
  }

  return (
    <SortableContext
      items={sections.map((s) => s.id)}
      strategy={verticalListSortingStrategy}
    >
      <Box sx={{ p: 2 }}>
        {sections.map((section) => (
          <SectionBlock
            key={section.id}
            id={section.id}
            title={section.title}
            items={section.items}
            draggable={true}
          />
        ))}
      </Box>
    </SortableContext>
  );
};

export default SectionGrid;

import React from "react";
import SectionBlock from "./SectionBlock";
import type { Section } from "../../types/sectionGrid";
import { Box } from "@mui/material";

type SectionGridProps = {
  sections: Section[];
};

const SectionGrid: React.FC<SectionGridProps> = ({ sections }) => {
  return (
    <Box sx={{ p: 2 }}>
      {sections.map((section) => (
        <SectionBlock
          key={section.id}
          id={section.id}
          title={section.title}
          items={section.items}
        />
      ))}
    </Box>
  );
};

export default SectionGrid;

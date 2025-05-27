import React from "react";
import SectionBlock from "./SectionBlock";
import type { Section } from "../../../types/section";
import { Box } from "@mui/material";

type Props = {
  sections: Section[];
  draggable?: boolean;
};

const SectionGrid: React.FC<Props> = ({ sections }) => {
  return (
    <Box sx={{ p: 2 }}>
      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </Box>
  );
};

export default SectionGrid;

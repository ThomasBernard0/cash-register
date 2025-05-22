import React from "react";
import SectionBlock from "./SectionBlock";
import type { Section } from "../../types/sectionGrid";

type SectionGridProps = {
  sections: Section[];
};

const SectionGrid: React.FC<SectionGridProps> = ({ sections }) => {
  return (
    <>
      {sections.map((section) => (
        <SectionBlock
          key={section.id}
          id={section.id}
          title={section.title}
          items={section.items}
        />
      ))}
    </>
  );
};

export default SectionGrid;

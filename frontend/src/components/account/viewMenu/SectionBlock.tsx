import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import ItemCard from "./ItemCard";
import type { Item } from "../../../types/section";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SectionBlockProps = {
  id: string;
  title: string;
  items: Item[];
  draggable?: boolean;
};

const SectionBlock: React.FC<SectionBlockProps> = ({
  id,
  title,
  items,
  draggable = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = draggable
    ? useSortable({ id })
    : {
        attributes: {},
        listeners: {},
        setNodeRef: () => null,
        transform: null,
        transition: null,
      };

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition ?? undefined,
  };

  return (
    <Box
      ref={draggable ? setNodeRef : undefined}
      style={style}
      {...attributes}
      {...listeners}
      mb={4}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid size={3} key={item.id}>
            <ItemCard id={item.id} label={item.label} />
          </Grid>
        ))}
        {items.length === 0 && (
          <Grid size={3}>
            <Paper elevation={0} sx={{ p: 2, color: "gray" }}>
              No items in this section.
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SectionBlock;

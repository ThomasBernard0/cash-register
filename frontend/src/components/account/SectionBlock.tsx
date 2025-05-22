import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import ItemCard from "./ItemCard";
import type { Item } from "../../types/section";

type SectionBlockProps = {
  id: number;
  title: string;
  items: Item[];
};

const SectionBlock: React.FC<SectionBlockProps> = ({ title, items }) => {
  return (
    <Box mb={4}>
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

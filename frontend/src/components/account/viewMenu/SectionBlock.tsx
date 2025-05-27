import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import ItemCard from "./ItemCard";
import { type CartItem, type Item, type Section } from "../../../types/section";

type Props = {
  section: Section;
  cartItems: CartItem[];
  addToCart: (sectionId: string, sectionTitle: string, item: Item) => void;
  removeFromCart: (sectionId: string, itemId: string) => void;
};

const SectionBlock: React.FC<Props> = ({
  section,
  cartItems,
  addToCart,
  removeFromCart,
}) => {
  return (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        {section.title}
      </Typography>
      <Grid container spacing={2}>
        {section.items.map((item) => (
          <Grid size={3} key={item.id}>
            <ItemCard
              item={item}
              backgroundColor={section.color}
              isInCart={cartItems.some((ci) => ci.item.id === item.id)}
              addToCart={addToCart}
              sectionTitle={section.title}
              removeFromCart={removeFromCart}
            />
          </Grid>
        ))}
        {section.items.length === 0 && (
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

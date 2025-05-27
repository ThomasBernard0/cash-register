import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import type { Item } from "../../../types/section";
import RemoveIcon from "@mui/icons-material/Remove";
import { getDarkerColor } from "../../../helpers/getDarkerColor";

type Props = {
  item: Item;
  backgroundColor: string;
  count: number;
  addToCart: (sectionId: string, sectionTitle: string, item: Item) => void;
  sectionTitle: string;
  removeFromCart: (sectionId: string, itemId: string) => void;
};

const ItemCard: React.FC<Props> = ({
  item,
  backgroundColor,
  count,
  addToCart,
  sectionTitle,
  removeFromCart,
}) => {
  return (
    <Card
      sx={{
        minHeight: 100,
        maxHeight: 180,
        display: "flex",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent
        sx={{
          minHeight: 100,
          maxHeight: 180,
          flexBasis: "75%",
          textAlign: "left",
          backgroundColor: backgroundColor,
          cursor: "pointer",
        }}
        onClick={() => addToCart(item.sectionId, sectionTitle, item)}
      >
        <Typography>{item.label}</Typography>
      </CardContent>
      <Button
        sx={{
          flexBasis: "25%",
          padding: 0,
          minWidth: 0,
          borderRadius: 0,
          backgroundColor: getDarkerColor(backgroundColor),
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          cursor: "pointer",
          color: "black",
        }}
        onClick={() => removeFromCart(item.sectionId, item.id)}
      >
        <Typography>{count}</Typography>
        <RemoveIcon sx={{ fontSize: 18 }} />
      </Button>
    </Card>
  );
};

export default ItemCard;

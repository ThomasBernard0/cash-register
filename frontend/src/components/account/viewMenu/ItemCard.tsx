import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import type { Item } from "../../../types/section";
import RemoveIcon from "@mui/icons-material/Remove";
import { getDarkerColor } from "../../../helpers/getDarkerColor";

type Props = {
  item: Item;
  count: number;
  addToCart: (sectionId: string, sectionTitle: string, item: Item) => void;
  sectionTitle: string;
  removeFromCart: (sectionId: string, itemId: string) => void;
};

const ItemCard: React.FC<Props> = ({
  item,
  count,
  addToCart,
  sectionTitle,
  removeFromCart,
}) => {
  return (
    <Card
      sx={{
        minHeight: 100,
        height: "100%",
        display: "flex",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent
        sx={{
          minHeight: 100,
          flexBasis: "75%",
          textAlign: "left",
          backgroundColor: item.color,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onClick={() => addToCart(item.sectionId, sectionTitle, item)}
      >
        <Typography variant="h6" fontWeight="bold">{item.label}</Typography>
        <Typography variant="h6" fontWeight="bold">{(item.priceInCent / 100).toFixed(2)}€</Typography>
      </CardContent>
      <Button
        sx={{
          flexBasis: "25%",
          padding: 0,
          minWidth: 0,
          borderRadius: 0,
          backgroundColor: getDarkerColor(item.color),
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          cursor: "pointer",
          color: "black",
        }}
        onClick={() => removeFromCart(item.sectionId, item.id)}
      >
        <Typography variant="h6" fontWeight="bold">{count}</Typography>
        <RemoveIcon sx={{ fontSize: 18 }} />
      </Button>
    </Card>
  );
};

export default ItemCard;

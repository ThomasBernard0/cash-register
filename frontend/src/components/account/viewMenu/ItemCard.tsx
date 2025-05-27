import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import type { Item } from "../../../types/section";
import RemoveIcon from "@mui/icons-material/Remove";

type Props = {
  item: Item;
  backgroundColor: string;
  isInCart: boolean;
};

const ItemCard: React.FC<Props> = ({ item, backgroundColor, isInCart }) => {
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
      >
        <Typography>{item.label}</Typography>
      </CardContent>
      <Button
        disabled
        sx={{
          flexBasis: "25%",
          padding: 0,
          minWidth: 0,
          borderRadius: 0,
          backgroundColor: isInCart ? "red" : "grey",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <RemoveIcon sx={{ fontSize: 18, color: "black" }} />
      </Button>
    </Card>
  );
};

export default ItemCard;

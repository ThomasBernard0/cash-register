import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import type { Item } from "../../../types/section";

type Props = {
  item: Item;
  color: string;
};

const ItemCard: React.FC<Props> = ({ item, color }) => {
  return (
    <Card
      sx={{
        minHeight: 100,
        maxHeight: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: color,
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography noWrap>{item.label}</Typography>
      </CardContent>
    </Card>
  );
};

export default ItemCard;

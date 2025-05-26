import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

type ItemCardProps = {
  id: string;
  label: string;
};

const ItemCard: React.FC<ItemCardProps> = ({ label }) => {
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
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography noWrap>{label}</Typography>
      </CardContent>
    </Card>
  );
};

export default ItemCard;

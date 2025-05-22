import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

type ItemCardProps = {
  id: number;
  label: string;
};

const ItemCard: React.FC<ItemCardProps> = ({ label }) => {
  return (
    <Card>
      <CardContent>
        <Typography>{label}</Typography>
      </CardContent>
    </Card>
  );
};

export default ItemCard;

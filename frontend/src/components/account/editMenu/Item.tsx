import React, { useEffect } from "react";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import Box from "@mui/material/Box";
import EditAction from "./EditAction";
import { Typography } from "@mui/material";

type Props = {
  label: React.ReactNode;
  onEdit?(): void;
  onDelete?(): void;
  dragOverlay?: boolean;
  dragging?: boolean;
  transform?: Transform | null;
  transition?: string | null;
  listeners?: DraggableSyntheticListeners;
};

const Item = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    (
      {
        label,
        onEdit,
        onDelete,
        dragOverlay,
        dragging,
        transform,
        transition,
        listeners,
      },
      ref
    ) => {
      useEffect(() => {
        if (dragOverlay) {
          document.body.style.cursor = "grabbing";
          return () => {
            document.body.style.cursor = "";
          };
        }
      }, [dragOverlay]);

      return (
        <Box sx={{ position: "relative" }}>
          <Box
            ref={ref}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: 100,
              border: "1px solid black",
              transform: transform
                ? `translate3d(${Math.round(transform.x)}px, ${Math.round(
                    transform.y
                  )}px, 0) scale(${transform.scaleX ?? 1}, ${
                    transform.scaleY ?? 1
                  })`
                : undefined,
              transition: transition ?? undefined,
              opacity: dragOverlay ? 1 : dragging ? 0.5 : 1,
              zIndex: dragOverlay ? 999 : "auto",
            }}
            {...listeners}
          >
            <Box sx={{ height: "40px", display: "flex" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography>{label}</Typography>
              </Box>
            </Box>
          </Box>
          <EditAction
            onEdit={onEdit ? onEdit : () => null}
            onDelete={onDelete ? onDelete : () => null}
            absolute={true}
          />
        </Box>
      );
    }
  )
);

export default Item;

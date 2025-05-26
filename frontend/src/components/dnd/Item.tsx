import React, { useEffect } from "react";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";

import Remove from "../account/editMenu/Remove";

type Props = {
  dragOverlay?: boolean;
  dragging?: boolean;
  transform?: Transform | null;
  transition?: string | null;
  listeners?: DraggableSyntheticListeners;
  value: React.ReactNode;
  onRemove?(): void;
};

const Item = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    (
      {
        dragOverlay,
        dragging,
        transform,
        transition,
        listeners,
        value,
        onRemove,
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
        <div
          ref={ref}
          style={{
            width: "100%",
            height: "100px",
            border: "solid 1px black",
            transform: transform
              ? `translate3d(${Math.round(transform.x)}px, ${Math.round(
                  transform.y
                )}px, 0) scale(${transform.scaleX ?? 1}, ${
                  transform.scaleY ?? 1
                })`
              : undefined,
            transition: transition ?? undefined,
            opacity: dragOverlay ? 1 : dragging ? 0.5 : 1,
            zIndex: dragOverlay ? 999 : undefined,
          }}
          {...listeners}
        >
          {value}
          {onRemove && <Remove onClick={onRemove} />}
        </div>
      );
    }
  )
);

export default Item;

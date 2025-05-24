import React, { useEffect } from "react";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";

import { Remove } from "./Remove";

export interface Props {
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  value: React.ReactNode;
  onRemove?(): void;
  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    transform: Props["transform"];
    transition: Props["transition"];
    value: Props["value"];
  }): React.ReactElement;
}

const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        transition,
        transform,
        value,
        ...props
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          listeners,
          ref,
          transform,
          transition,
          value,
        })
      ) : (
        <li
          ref={ref}
          style={{
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
            listStyle: "none",
            height,
          }}
        >
          <div
            style={{ width: "200px", border: "solid 1px black" }}
            data-cypress="draggable-item"
            {...listeners}
            {...props}
            tabIndex={0}
          >
            {value}
            <span>{onRemove ? <Remove onClick={onRemove} /> : null}</span>
          </div>
        </li>
      );
    }
  )
);

export default Item;

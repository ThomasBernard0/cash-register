import React, { forwardRef } from "react";
import Handle from "../account/edit/Handle";
import Remove from "../account/edit/Remove";

export interface SectionProps {
  children: React.ReactNode;
  label?: string;
  style?: React.CSSProperties;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onRemove?(): void;
}

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, handleProps, label, onRemove, style }, ref) => {
    return (
      <div
        ref={ref}
        style={{ ...style, height: "200px", border: "solid 2px black" }}
      >
        {label && (
          <div style={{ display: "flex" }}>
            {label}
            <div>
              {onRemove && <Remove onClick={onRemove} />}
              <Handle {...handleProps} />
            </div>
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(4, minmax(0, 1fr))`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);
export default Section;

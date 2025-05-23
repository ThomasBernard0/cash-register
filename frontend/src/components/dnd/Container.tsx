import React, { forwardRef } from "react";
import { Handle } from "./Handle";
import { Remove } from "./Remove";

export interface ContainerProps {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
}

const ContainerDiv = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      columns = 1,
      handleProps,
      label,
      onRemove,
      placeholder,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        {...props}
        ref={ref}
        style={{ ...style, "--columns": columns } as React.CSSProperties}
      >
        {label && (
          <div>
            {label}
            <div>
              {onRemove && <Remove onClick={onRemove} />}
              <Handle {...handleProps} />
            </div>
          </div>
        )}
        {placeholder ? children : <ul>{children}</ul>}
      </div>
    );
  }
);

const ContainerButton = forwardRef<HTMLButtonElement, ContainerProps>(
  (
    {
      children,
      columns = 1,
      handleProps,
      label,
      onClick,
      onRemove,
      placeholder,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        style={{ ...style, "--columns": columns } as React.CSSProperties}
        onClick={onClick}
        tabIndex={0}
      >
        {label && (
          <div>
            {label}
            <div>
              {onRemove && <Remove onClick={onRemove} />}
              <Handle {...handleProps} />
            </div>
          </div>
        )}
        {placeholder ? children : <ul>{children}</ul>}
      </button>
    );
  }
);

export const Container = forwardRef<
  HTMLDivElement | HTMLButtonElement,
  ContainerProps
>((props, ref) => {
  if (props.onClick) {
    return (
      <ContainerButton {...props} ref={ref as React.Ref<HTMLButtonElement>} />
    );
  }
  return <ContainerDiv {...props} ref={ref as React.Ref<HTMLDivElement>} />;
});

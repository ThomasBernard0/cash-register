import React, { forwardRef } from "react";
import { Box, Paper } from "@mui/material";
import Handle from "./Handle";
import EditAction from "./EditAction";

type Props = {
  title?: string;
  onEdit?(): void;
  onDelete?(): void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
};

const Section = forwardRef<HTMLDivElement, Props>(
  ({ title, onEdit, onDelete, children, handleProps, style }, ref) => {
    return (
      <Paper
        ref={ref}
        elevation={3}
        sx={{
          width: "100%",
          height: "auto",
          boxSizing: "border-box",
          p: 2,
          border: "2px solid black",
          ...style,
        }}
      >
        {title && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box fontWeight="bold">{title}</Box>
            <Box display="flex" alignItems="center" gap={1}>
              <EditAction
                onEdit={onEdit ? onEdit : () => null}
                onDelete={onDelete ? onDelete : () => null}
              />
              <Handle {...handleProps} />
            </Box>
          </Box>
        )}

        <Box
          display="grid"
          gridTemplateColumns="repeat(4,calc(((100% - 3 * 17px) / 4)))"
          gap="16px"
          sx={{ boxSizing: "border-box" }}
        >
          {children}
        </Box>
      </Paper>
    );
  }
);

export default Section;

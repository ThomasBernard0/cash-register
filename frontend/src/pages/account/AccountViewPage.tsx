import React from "react";
import SectionGrid from "../../components/account/viewMenu/SectionGrid";
import { useSections } from "../../api/section";
import { Box, Typography } from "@mui/material";

const AccountViewPage: React.FC = () => {
  const { sections, loading, error } = useSections();

  if (loading) {
    return <div>Loading sections...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          width: "80%",
          overflowY: "auto",
          p: 2,
        }}
      >
        <SectionGrid sections={sections} />
      </Box>
      <Box
        sx={{
          width: "20%",
          p: 2,
          bgcolor: "#e0e0e0",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Fixed Panel
        </Typography>
        <Typography>
          Content here stays fixed and does not scroll with the main content.
        </Typography>
      </Box>
    </Box>
  );
};

export default AccountViewPage;

import React, { useState } from "react";
import SectionGrid from "../../components/account/SectionGrid";
import { useSections } from "../../api/section";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddSectionElementModal from "../../components/account/AddSectionElementModal";

const AccountHubPage: React.FC = () => {
  const { sections, loading, error, refetch } = useSections();
  const [isAddElementModalOpen, setIsAddElementModalOpen] = useState(false);

  if (loading) {
    return <div>Loading sections...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  return (
    <>
      EDIT
      <SectionGrid sections={sections} />
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setIsAddElementModalOpen(true)}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      <AddSectionElementModal
        open={isAddElementModalOpen}
        onClose={() => {
          setIsAddElementModalOpen(false);
        }}
        onCreated={refetch}
      />
    </>
  );
};

export default AccountHubPage;

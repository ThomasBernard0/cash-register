import React from "react";
import { useSections } from "../../api/section";
import { MultipleContainers } from "../../components/dnd/MultipleContainers";

const AccountHubPage: React.FC = () => {
  const { sections, loading, error } = useSections();

  if (loading) {
    return <div>Loading sections...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return <MultipleContainers />;
};

export default AccountHubPage;

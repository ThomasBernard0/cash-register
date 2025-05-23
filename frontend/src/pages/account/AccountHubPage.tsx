import React from "react";
import SectionGrid from "../../components/account/SectionGrid";
import { useSections } from "../../api/section";

const AccountHubPage: React.FC = () => {
  const { sections, loading, error } = useSections();

  if (loading) {
    return <div>Loading sections...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return <SectionGrid sections={sections} />;
};

export default AccountHubPage;

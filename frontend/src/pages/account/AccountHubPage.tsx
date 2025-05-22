import React from "react";
import SectionGrid from "../../components/account/SectionGrid";
import type { Section } from "../../types/section";

const AccountHubPage: React.FC = () => {
  const mockSections: Section[] = [
    {
      id: 1,
      title: "Boissons",
      color: "#FF5733",
      order: 1,
      items: [
        {
          id: 1,
          label: "SUPERLONGNOMQUIGENELEBOND EROULEMENTDUFUNENCOREPLUSLONG",
          priceInCent: 250,
          order: 1,
        },
        { id: 2, label: "2", priceInCent: 150, order: 2 },
        { id: 3, label: "3", priceInCent: 300, order: 3 },
      ],
    },
    {
      id: 2,
      title: "Snacks",
      color: "#33C1FF",
      order: 2,
      items: [
        { id: 4, label: "A", priceInCent: 200, order: 1 },
        { id: 5, label: "B", priceInCent: 180, order: 2 },
        { id: 6, label: "C", priceInCent: 220, order: 3 },
        { id: 7, label: "D", priceInCent: 220, order: 4 },
        { id: 8, label: "E", priceInCent: 220, order: 5 },
        { id: 9, label: "F", priceInCent: 220, order: 6 },
        { id: 10, label: "G", priceInCent: 220, order: 7 },
        { id: 11, label: "H", priceInCent: 220, order: 8 },
        { id: 12, label: "I", priceInCent: 220, order: 9 },
      ],
    },
    {
      id: 3,
      title: "Desserts",
      color: "#8D33FF",
      order: 3,
      items: [
        { id: 13, label: "6", priceInCent: 450, order: 1 },
        { id: 14, label: "7", priceInCent: 500, order: 2 },
        { id: 15, label: "8", priceInCent: 450, order: 3 },
        { id: 16, label: "9", priceInCent: 450, order: 4 },
        { id: 17, label: "10", priceInCent: 450, order: 5 },
        { id: 18, label: "11", priceInCent: 450, order: 6 },
        { id: 19, label: "12", priceInCent: 450, order: 7 },
      ],
    },
    {
      id: 4,
      title: "Vide",
      color: "#FFbbaa",
      order: 4,
      items: [],
    },
  ];

  return <SectionGrid sections={mockSections} />;
};

export default AccountHubPage;

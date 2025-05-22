import React from "react";
import SectionGrid from "../../components/account/SectionGrid";
import type { Section } from "../../types/sectionGrid";

const AccountHubPage: React.FC = () => {
  const mockSections: Section[] = [
    {
      id: 1,
      title: "Boissons",
      color: "#FF5733",
      order: 1,
      items: [
        { id: 1, label: "Coca-Cola", priceInCent: 250, order: 1 },
        { id: 2, label: "Eau minérale", priceInCent: 150, order: 2 },
        { id: 3, label: "Jus d'orange", priceInCent: 300, order: 3 },
      ],
    },
    {
      id: 2,
      title: "Snacks",
      color: "#33C1FF",
      order: 2,
      items: [
        { id: 4, label: "Chips", priceInCent: 200, order: 1 },
        { id: 5, label: "Barre chocolatée", priceInCent: 180, order: 2 },
        { id: 6, label: "Popcorn", priceInCent: 220, order: 3 },
        { id: 7, label: "Popcorn", priceInCent: 220, order: 3 },
        { id: 8, label: "Popcorn", priceInCent: 220, order: 3 },
        { id: 9, label: "Popcorn", priceInCent: 220, order: 3 },
        { id: 10, label: "Popcorn", priceInCent: 220, order: 3 },
        { id: 11, label: "Popcorn", priceInCent: 220, order: 3 },
        { id: 12, label: "Popcorn", priceInCent: 220, order: 3 },
      ],
    },
    {
      id: 3,
      title: "Desserts",
      color: "#8D33FF",
      order: 3,
      items: [
        { id: 13, label: "Tarte aux pommes", priceInCent: 450, order: 1 },
        { id: 14, label: "Crème brûlée", priceInCent: 500, order: 2 },
        { id: 15, label: "Tarte aux pommes", priceInCent: 450, order: 1 },
        { id: 16, label: "Tarte aux pommes", priceInCent: 450, order: 1 },
        { id: 17, label: "Tarte aux pommes", priceInCent: 450, order: 1 },
        { id: 18, label: "Tarte aux pommes", priceInCent: 450, order: 1 },
        { id: 19, label: "Tarte aux pommes", priceInCent: 450, order: 1 },
      ],
    },
  ];

  return <SectionGrid sections={mockSections} />;
};

export default AccountHubPage;

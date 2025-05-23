export type Section = {
  id: string;
  title: string;
  color: string;
  order: number;
  items: Item[];
};

export type Item = {
  id: string;
  label: string;
  priceInCent: number;
  order: number;
  sectionId: string;
};

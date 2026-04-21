export type Section = {
  id: string;
  title: string;
  order: number;
  items: Item[];
};

export type Item = {
  id: string;
  label: string;
  priceInCent: number;
  color: string;
  order: number;
  sectionId: string;
};

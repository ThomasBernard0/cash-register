export type Section = {
  id: number;
  title: string;
  color: string;
  order: number;
  items: Item[];
};

export type Item = {
  id: number;
  label: string;
  priceInCent: number;
  order: number;
  sectionId: string;
};

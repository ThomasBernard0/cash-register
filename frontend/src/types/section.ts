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

export type CartItem = {
  item: Item;
  quantity: number;
};

export type Cart = {
  [sectionId: string]: {
    sectionLabel: string;
    items: {
      [itemId: string]: CartItem;
    };
  };
};

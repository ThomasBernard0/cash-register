import type { Item } from "./section";

export type CartItem = {
  item: Item;
  quantity: number;
};

export type Cart = {
  [sectionId: string]: {
    sectionTitle: string;
    items: {
      [itemId: string]: CartItem;
    };
  };
};

export type OrderItem = {
  idItem: string;
  quantity: number;
};

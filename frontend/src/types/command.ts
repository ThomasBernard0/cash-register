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

export type CommandItem = {
  id: string;
  label: string;
  priceInCent: number;
  quantity: number;
};

export type Command = {
  id: number;
  totalPriceInCent: number;
  createdAt: Date;
  type: string;
  status: string;
  items: CommandItem[];
};

type CreateSectionDto = {
  title: string;
  color: string;
  order: number;
};

type UpdateSectionDto = Partial<CreateSectionDto>;

type CreateItemDto = {
  label: string;
  priceInCent: number;
  order: number;
  sectionId: string;
};

type UpdateItemDto = Partial<CreateItemDto>;

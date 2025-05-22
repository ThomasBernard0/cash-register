type CreateSectionDto = {
  title: string;
  color: string;
};

type UpdateSectionDto = Partial<CreateSectionDto>;

type CreateItemDto = {
  label: string;
  priceInCent: number;
  sectionId: string;
};

type UpdateItemDto = Partial<CreateItemDto>;

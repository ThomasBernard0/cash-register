export type Session = {
  id: string;
  totalRevenueInCent: number;
  createdAt: Date;
  closedAt: Date | null;
  status: string;
};

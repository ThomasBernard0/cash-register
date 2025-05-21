export type AccountSummary = {
  id: number;
  name: string;
};

export type CreateAccountDto = { name: string; password: string };

export type ChangePasswordDto = { id: number; password: string };

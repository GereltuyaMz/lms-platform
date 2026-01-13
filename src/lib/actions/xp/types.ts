export type XPResult = {
  success: boolean;
  message: string;
  xpAwarded?: number;
};

export type XPTransaction = {
  id: string;
  amount: number;
  source_type: string;
  description: string;
  created_at: string;
  metadata: Record<string, unknown>;
};

export type XPCalculation = {
  amount: number;
  metadata: Record<string, unknown>;
};

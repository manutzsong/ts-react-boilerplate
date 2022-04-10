import { DataSourceTransactions } from "./LazadaTransactions";

export type LaqoliYearlyTransactionsData = {
  year: number;
  total: number;
  lazadaFees: number;
  lazadaMarketingFees: number;
  dataSourceTransactions: DataSourceTransactions[];
};

export interface Transaction {
  amount: number;
  id: string;
  merchantName: string;
  rawDescription: string;
  transactionDate: Date;
  categoryName: string | null;
  isExpense: Boolean;
}

export interface Subscription {
  id: String;
  user_id: String;
  from_date: Date;
  name: String;
  amount: number;
  merchantName: String;
  frequency_days: number;
  confidence: number;
  is_active: Boolean;
}

export interface TransactionsSummary {
  transactionsSummary: {
    categoryId: number;
    categoryName: string;
    totalAmount: number;
  }[];
}

export interface latestTransactions {
  latestTransactions: {
    id: string;
    transactionDate: Date;
    merchantName: string;
    categoryName: string;
    amount: number;
    isExpense: boolean;
  }[];
}

export interface balanceStats {
  balanceStatsDTO: {
    income: number;
    expense: number;
    subscriptions: number;
    balance: number;
  };
}

export interface monthlyTrends {
  monthlyTrends: {
    month: Date;
    income: number;
    expense: number;
  }[];
}

export interface Anomalies {
  id: string;
  userId: string;
  anomalyType: string;
  categoryId: number;
  month: Date;
  zscore: number;
  expectedAmount: number;
  actualAmount: number;
  explanation: string;
  isDismissed: boolean;
  anomalyClass: "TRANSACTION" | "CATEGORY";
}

export interface Merchant {
  categoryName: string;
  id: string;
  merchantAliases: string[];
  merchantName: string;
}

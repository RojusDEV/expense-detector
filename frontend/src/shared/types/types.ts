export interface Transaction {
  amount: number
  id: string
  merchantName: string
  rawDescription: string
  transactionDate: Date
  categoryName: string | null
  isExpense: Boolean
};

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
};


export interface Merchant {
        categoryName: string,
        id: string,
        merchantAliases: string[],
        merchantName: string
} 
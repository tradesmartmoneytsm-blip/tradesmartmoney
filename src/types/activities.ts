// Activity types for the application
export interface IntradayActivity {
  id: number;
  stock_name: string;
  activity_name: string;
  activity_timestamp: string;
  trading_date: string;
  is_active: boolean;
}

export interface IntradayActivityFilters {
  stock_names?: string[];
  limit?: number;
  offset?: number;
}

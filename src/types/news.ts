export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
  source: string;
  url?: string;
  pubDate: string;
}

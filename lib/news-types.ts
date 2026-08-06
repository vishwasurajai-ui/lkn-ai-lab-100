export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  league?: string | null;
};

export type NewsArticleRow = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  published_at: string;
  source: string;
  league: string | null;
  created_at: string;
};

export function rowToArticle(row: NewsArticleRow): NewsArticle {
  return {
    title: row.title,
    description: row.description ?? "",
    url: row.url,
    publishedAt: row.published_at,
    source: row.source,
    league: row.league,
  };
}

export function startOfTodayUtc(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

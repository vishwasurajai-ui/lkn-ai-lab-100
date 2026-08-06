import Parser from "rss-parser";
import { RSS_FEEDS } from "./rss-feeds";
import { detectLeague, isToday } from "./detect-league";
import { createSupabaseAdmin } from "./supabase/server";

type ParsedItem = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  league: string | null;
};

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "TheFootballFeed/1.0 (RSS poller)",
  },
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchFeedItems(feedUrl: string, source: string): Promise<ParsedItem[]> {
  const feed = await parser.parseURL(feedUrl);
  const items: ParsedItem[] = [];

  for (const item of feed.items) {
    if (!item.title || !item.link) continue;

    const pubDate = item.isoDate ?? item.pubDate;
    if (!pubDate) continue;
    if (!isToday(pubDate)) continue;

    const description = stripHtml(item.contentSnippet ?? item.content ?? item.summary ?? "");

    items.push({
      title: item.title.trim(),
      description,
      url: item.link.trim(),
      publishedAt: new Date(pubDate).toISOString(),
      source,
      league: detectLeague(item.title, description),
    });
  }

  return items;
}

export async function pollRssFeeds(): Promise<{ inserted: number; skipped: number; errors: string[] }> {
  const supabase = createSupabaseAdmin();
  const seen = new Set<string>();
  const errors: string[] = [];
  let inserted = 0;
  let skipped = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const items = await fetchFeedItems(feed.url, feed.source);

      for (const item of items) {
        if (seen.has(item.url)) {
          skipped += 1;
          continue;
        }
        seen.add(item.url);

        const { error } = await supabase.from("news_articles").upsert(
          {
            title: item.title,
            description: item.description,
            url: item.url,
            published_at: item.publishedAt,
            source: item.source,
            league: item.league,
          },
          { onConflict: "url", ignoreDuplicates: false }
        );

        if (error) {
          errors.push(`${feed.source}: ${error.message}`);
          skipped += 1;
        } else {
          inserted += 1;
        }
      }
    } catch (err) {
      errors.push(`${feed.source}: ${err instanceof Error ? err.message : "fetch failed"}`);
    }
  }

  return { inserted, skipped, errors };
}

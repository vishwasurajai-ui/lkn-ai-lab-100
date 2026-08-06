import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Parser from "npm:rss-parser@3.13.0";

const RSS_FEEDS = [
  { url: "https://feeds.bbci.co.uk/sport/football/rss.xml", source: "BBC Sport" },
  { url: "https://www.espn.com/espn/rss/soccer/news", source: "ESPN" },
  { url: "https://www.theguardian.com/football/rss", source: "The Guardian" },
];

const LEAGUE_KEYWORDS: Record<string, string[]> = {
  "Premier League": ["premier league", "epl", "liverpool", "arsenal", "chelsea", "manchester"],
  "La Liga": ["la liga", "real madrid", "barcelona", "atletico madrid"],
  "Serie A": ["serie a", "juventus", "inter milan", "ac milan", "napoli", "roma"],
  Bundesliga: ["bundesliga", "bayern", "dortmund", "leverkusen", "leipzig"],
  "Ligue 1": ["ligue 1", "psg", "paris saint-germain", "marseille", "monaco", "lyon"],
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function isToday(isoDate: string) {
  const d = new Date(isoDate);
  const now = new Date();
  return (
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate()
  );
}

function detectLeague(title: string, description: string): string | null {
  const text = `${title} ${description}`.toLowerCase();
  let best: string | null = null;
  let bestScore = 0;
  for (const [league, keywords] of Object.entries(LEAGUE_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = league;
    }
  }
  return bestScore > 0 ? best : null;
}

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "TheFootballFeed/1.0 (Supabase cron)" },
});

Deno.serve(async (req) => {
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret) {
    const headerSecret = req.headers.get("x-cron-secret");
    const auth = req.headers.get("authorization");
    const ok =
      headerSecret === cronSecret || auth === `Bearer ${cronSecret}`;
    if (!ok) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const seen = new Set<string>();
  const errors: string[] = [];
  let inserted = 0;
  let skipped = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const item of parsed.items) {
        if (!item.title || !item.link) continue;
        const pubDate = item.isoDate ?? item.pubDate;
        if (!pubDate || !isToday(pubDate)) continue;

        const description = stripHtml(
          item.contentSnippet ?? item.content ?? item.summary ?? ""
        );
        const url = item.link.trim();
        if (seen.has(url)) {
          skipped += 1;
          continue;
        }
        seen.add(url);

        const { error } = await supabase.from("news_articles").upsert(
          {
            title: item.title.trim(),
            description,
            url,
            published_at: new Date(pubDate).toISOString(),
            source: feed.source,
            league: detectLeague(item.title, description),
          },
          { onConflict: "url" }
        );

        if (error) {
          errors.push(`${feed.source}: ${error.message}`);
          skipped += 1;
        } else {
          inserted += 1;
        }
      }
    } catch (err) {
      errors.push(
        `${feed.source}: ${err instanceof Error ? err.message : "fetch failed"}`
      );
    }
  }

  return new Response(JSON.stringify({ ok: true, inserted, skipped, errors }), {
    headers: { "Content-Type": "application/json" },
  });
});

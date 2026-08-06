import { NextRequest, NextResponse } from "next/server";
import { ALL_LEAGUES_OPTION, type LeagueFilter } from "@/lib/leagues";
import { rowToArticle, startOfTodayUtc, type NewsArticleRow } from "@/lib/news-types";
import { createSupabaseAnon } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get("scope");
  const league = req.nextUrl.searchParams.get("league") as LeagueFilter | null;
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  try {
    const supabase = createSupabaseAnon();
    const todayStart = startOfTodayUtc();

    let query = supabase
      .from("news_articles")
      .select("*")
      .gte("published_at", todayStart)
      .order("published_at", { ascending: false });

    if (scope === "global") {
      if (limit) query = query.limit(limit);
    } else if (league && league !== ALL_LEAGUES_OPTION) {
      query = query.eq("league", league);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message, articles: [], empty: true },
        { status: 502 }
      );
    }

    const rows = (data ?? []) as NewsArticleRow[];
    const articles = rows.map(rowToArticle);

    return NextResponse.json({
      articles,
      empty: articles.length === 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load news.";
    return NextResponse.json({ error: message, articles: [], empty: true }, { status: 503 });
  }
}

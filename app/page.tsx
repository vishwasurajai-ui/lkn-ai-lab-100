"use client";

// ===============================
// v1.0.0 — The Football Feed (live news)
// ===============================
// - Today's News: global top 5 from Supabase (RSS-backed)
// - League News: filter by league/ALL + Follow Teams
// - RSS polled via /api/news/poll (cron every 15 min)
// ===============================

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  LEAGUES,
  ALL_LEAGUES_OPTION,
  getLeague,
  getAllTeams,
  getLeagueForTeam,
  type LeagueFilter,
} from "@/lib/leagues";
import type { NewsArticle } from "@/lib/news-types";
import {
  getFollowedTeams,
  toggleFollowedTeam,
  type FollowedTeamsMap,
} from "@/lib/followed-teams";
import { FootballFeedLogo } from "@/components/football-feed-logo";

type Tab = "scores" | "standings" | "minigames";

function articleMentionsTeam(article: NewsArticle, team: string): boolean {
  const haystack = `${article.title} ${article.description}`.toLowerCase();
  return haystack.includes(team.toLowerCase());
}

function NewsList({
  articles,
  showLeague,
}: {
  articles: NewsArticle[];
  showLeague?: boolean;
}) {
  return (
    <ul className="space-y-4">
      {articles.map((article) => (
        <li key={article.url} className="border-b border-zinc-300 pb-3 last:border-none last:pb-0">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <p className="font-medium text-sm text-zinc-900 group-hover:text-emerald-600 transition-colors">
              {article.title}
            </p>
            {article.description && (
              <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{article.description}</p>
            )}
            <p className="text-xs text-zinc-500 mt-1">
              {showLeague && article.league ? `${article.league} · ` : ""}
              {article.source} ·{" "}
              {new Date(article.publishedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const APP_NAME = "The Football Feed";
  const BACKGROUND = "bg-zinc-200 text-zinc-900";
  const CARD_STYLE = "bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm";
  const INPUT_STYLE = "bg-zinc-100 border border-zinc-400 text-zinc-900";
  const TAB_ACTIVE = "bg-emerald-600 text-white shadow-sm";
  const TAB_INACTIVE = "bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-50";
  const CHIP_ACTIVE = "bg-emerald-600 text-white border-emerald-600";
  const CHIP_INACTIVE = "bg-zinc-200 text-zinc-800 border-zinc-400 hover:border-zinc-500";

  const [leagueFilter, setLeagueFilter] = useState<LeagueFilter>("Premier League");
  const [activeTab, setActiveTab] = useState<Tab>("scores");
  const [followedMap, setFollowedMap] = useState<FollowedTeamsMap>({});
  const [showTeamPicker, setShowTeamPicker] = useState(false);

  const [globalNews, setGlobalNews] = useState<NewsArticle[]>([]);
  const [filterArticles, setFilterArticles] = useState<NewsArticle[]>([]);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);

  const isAllLeagues = leagueFilter === ALL_LEAGUES_OPTION;
  const leagueData = isAllLeagues ? null : getLeague(leagueFilter);
  const pickerTeams = isAllLeagues ? getAllTeams() : (leagueData?.teams ?? []);

  const followedTeams = useMemo(() => {
    if (isAllLeagues) {
      return [...new Set(Object.values(followedMap).flat())];
    }
    return followedMap[leagueFilter] ?? [];
  }, [followedMap, leagueFilter, isAllLeagues]);

  const fetchGlobalNews = useCallback(async () => {
    setGlobalLoading(true);
    setGlobalError(null);
    try {
      const res = await fetch("/api/news?scope=global&limit=5");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load news.");
      setGlobalNews(data.articles ?? []);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Failed to load news.");
      setGlobalNews([]);
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  const fetchLeagueNews = useCallback(async () => {
    setFilterLoading(true);
    setFilterError(null);
    try {
      const res = await fetch(`/api/news?league=${encodeURIComponent(leagueFilter)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load news.");
      setFilterArticles(data.articles ?? []);
    } catch (err) {
      setFilterError(err instanceof Error ? err.message : "Failed to load news.");
      setFilterArticles([]);
    } finally {
      setFilterLoading(false);
    }
  }, [leagueFilter]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchGlobalNews(), fetchLeagueNews()]);
  }, [fetchGlobalNews, fetchLeagueNews]);

  useEffect(() => {
    setFollowedMap(getFollowedTeams());
  }, []);

  useEffect(() => {
    fetchGlobalNews();
  }, [fetchGlobalNews]);

  useEffect(() => {
    fetchLeagueNews();
  }, [fetchLeagueNews]);

  const handleToggleTeam = (team: string) => {
    const storageLeague = isAllLeagues ? getLeagueForTeam(team) : leagueFilter;
    if (!storageLeague) return;
    const next = toggleFollowedTeam(storageLeague, team);
    setFollowedMap(next);
  };

  const filteredArticles = useMemo(() => {
    if (followedTeams.length === 0) return filterArticles;
    return filterArticles.filter((a) =>
      followedTeams.some((team) => articleMentionsTeam(a, team))
    );
  }, [filterArticles, followedTeams]);

  const filterLabel = isAllLeagues ? "all leagues" : leagueFilter;

  return (
    <main className={`min-h-screen ${BACKGROUND} flex justify-center pt-8 pb-12 px-4`}>
      <div className="w-full max-w-xl">

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FootballFeedLogo size={40} />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
              {APP_NAME}
            </h1>
          </div>
          <button
            onClick={refreshAll}
            disabled={globalLoading || filterLoading}
            className="text-xs text-zinc-500 hover:text-zinc-900 disabled:opacity-50"
          >
            {globalLoading || filterLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <section className={`${CARD_STYLE} p-4 mb-6`}>
          <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3">
            Today&apos;s News
          </h2>
          {globalLoading && <p className="text-sm text-zinc-500">Loading headlines...</p>}
          {globalError && !globalLoading && (
            <p className="text-sm text-red-600">{globalError}</p>
          )}
          {!globalLoading && !globalError && globalNews.length === 0 && (
            <p className="text-sm text-zinc-500">
              No headlines today yet. News syncs every 15 minutes.
            </p>
          )}
          {!globalLoading && globalNews.length > 0 && (
            <NewsList articles={globalNews} showLeague />
          )}
        </section>

        <section className={`${CARD_STYLE} p-4 mb-6`}>
          <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3">
            League News
          </h2>

          <select
            value={leagueFilter}
            onChange={(e) => {
              setLeagueFilter(e.target.value as LeagueFilter);
              setShowTeamPicker(false);
            }}
            className={`w-full p-3 rounded-lg mb-4 ${INPUT_STYLE}`}
          >
            <option value={ALL_LEAGUES_OPTION}>ALL</option>
            {LEAGUES.map((l) => (
              <option key={l.name} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>

          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Follow Teams
            </h3>
            <button
              onClick={() => setShowTeamPicker((v) => !v)}
              className="text-xs text-zinc-500 hover:text-zinc-900"
            >
              {showTeamPicker ? "Hide" : "+ Add"}
            </button>
          </div>

          {followedTeams.length === 0 && !showTeamPicker && (
            <p className="text-sm text-zinc-500 mb-4">
              Follow teams to filter news and scores.
            </p>
          )}

          {followedTeams.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {followedTeams.map((team) => (
                <button
                  key={team}
                  onClick={() => handleToggleTeam(team)}
                  className={`text-xs px-3 py-1 rounded-full border ${CHIP_ACTIVE}`}
                >
                  {team} ×
                </button>
              ))}
            </div>
          )}

          {showTeamPicker && (
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mb-4">
              {pickerTeams.map((team) => {
                const isFollowed = followedTeams.includes(team);
                return (
                  <button
                    key={team}
                    onClick={() => handleToggleTeam(team)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      isFollowed ? CHIP_ACTIVE : CHIP_INACTIVE
                    }`}
                  >
                    {team}
                  </button>
                );
              })}
            </div>
          )}

          {filterLoading && <p className="text-sm text-zinc-500">Loading headlines...</p>}
          {filterError && !filterLoading && (
            <p className="text-sm text-red-600">{filterError}</p>
          )}

          {!filterLoading && !filterError && filterArticles.length === 0 && (
            <p className="text-sm text-zinc-500">
              No headlines today for {filterLabel}. Check back later.
            </p>
          )}

          {!filterLoading &&
            !filterError &&
            filterArticles.length > 0 &&
            filteredArticles.length === 0 &&
            followedTeams.length > 0 && (
              <p className="text-sm text-zinc-500">
                No headlines today mentioning your followed teams.
              </p>
            )}

          {!filterLoading && filteredArticles.length > 0 && (
            <NewsList articles={filteredArticles} showLeague={isAllLeagues} />
          )}
        </section>

        <div className="flex gap-2 mb-4">
          {(["scores", "standings", "minigames"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? TAB_ACTIVE : TAB_INACTIVE
              }`}
            >
              {tab === "minigames" ? "Games" : tab}
            </button>
          ))}
        </div>

        <section className={`${CARD_STYLE} p-6 min-h-[120px] flex items-center justify-center`}>
          {activeTab === "scores" && (
            <p className="text-sm text-zinc-500 text-center">
              Scores coming in v2 — live fixtures for {filterLabel}.
            </p>
          )}
          {activeTab === "standings" && (
            <p className="text-sm text-zinc-500 text-center">
              Standings coming in v3 — league table for {filterLabel}.
            </p>
          )}
          {activeTab === "minigames" && (
            <p className="text-sm text-zinc-500 text-center">
              Minigames coming soon.
            </p>
          )}
        </section>

      </div>
    </main>
  );
}

"use client";

// ===============================
// v1.0.0 — European Soccer Hub (news feed UI)
// ===============================
// This version:
// - Today's News: global top 5 (not tied to team picker)
// - League News: sortable by league/ALL + Follow Teams filter
// - tab shell: Scores / Standings / Minigames (placeholders)
// - no backend / API wiring yet
// ===============================

import { useState, useEffect, useMemo } from "react";
import {
  LEAGUES,
  ALL_LEAGUES_OPTION,
  getLeague,
  getAllTeams,
  getLeagueForTeam,
  type LeagueFilter,
} from "@/lib/leagues";
import {
  getGlobalTopNews,
  getMockNewsForFilter,
  type NewsArticle,
} from "@/lib/mock-news";
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

function NewsList({ articles, showLeague }: { articles: NewsArticle[]; showLeague?: boolean }) {
  return (
    <ul className="space-y-4">
      {articles.map((article, i) => (
        <li key={i} className="border-b border-zinc-300 pb-3 last:border-none last:pb-0">
          <div className="block group cursor-default">
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
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  // ===============================
  // CONFIG (CUSTOMIZE YOUR APP)
  // ===============================

  const APP_NAME = "The Football Feed";
  const BACKGROUND = "bg-zinc-200 text-zinc-900";
  const CARD_STYLE = "bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm";
  const INPUT_STYLE = "bg-zinc-100 border border-zinc-400 text-zinc-900";
  const TAB_ACTIVE = "bg-emerald-600 text-white shadow-sm";
  const TAB_INACTIVE = "bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-50";
  const CHIP_ACTIVE = "bg-emerald-600 text-white border-emerald-600";
  const CHIP_INACTIVE = "bg-zinc-200 text-zinc-800 border-zinc-400 hover:border-zinc-500";

  // ===============================
  // STATE
  // ===============================

  const [leagueFilter, setLeagueFilter] = useState<LeagueFilter>("Premier League");
  const [activeTab, setActiveTab] = useState<Tab>("scores");
  const [followedMap, setFollowedMap] = useState<FollowedTeamsMap>({});
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAllLeagues = leagueFilter === ALL_LEAGUES_OPTION;
  const leagueData = isAllLeagues ? null : getLeague(leagueFilter);
  const pickerTeams = isAllLeagues ? getAllTeams() : (leagueData?.teams ?? []);

  const followedTeams = useMemo(() => {
    if (isAllLeagues) {
      return [...new Set(Object.values(followedMap).flat())];
    }
    return followedMap[leagueFilter] ?? [];
  }, [followedMap, leagueFilter, isAllLeagues]);

  const globalNews = useMemo(() => getGlobalTopNews(5), [refreshKey]);
  const filterArticles = useMemo(
    () => getMockNewsForFilter(leagueFilter),
    [leagueFilter, refreshKey]
  );

  // ===============================
  // FOLLOW TEAMS (localStorage)
  // ===============================

  useEffect(() => {
    setFollowedMap(getFollowedTeams());
  }, []);

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

  // ===============================
  // UI
  // ===============================

  return (
    <main className={`min-h-screen ${BACKGROUND} flex justify-center pt-8 pb-12 px-4`}>
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FootballFeedLogo size={40} />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
              {APP_NAME}
            </h1>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="text-xs text-zinc-500 hover:text-zinc-900"
          >
            Refresh
          </button>
        </div>

        {/* Today's News — global top 5, no team filter */}
        <section className={`${CARD_STYLE} p-4 mb-6`}>
          <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3">
            Today&apos;s News
          </h2>
          {globalNews.length === 0 ? (
            <p className="text-sm text-zinc-500">No headlines today. Check back later.</p>
          ) : (
            <NewsList articles={globalNews} showLeague />
          )}
        </section>

        {/* League News — sortable + follow teams */}
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

          {filterArticles.length === 0 && (
            <p className="text-sm text-zinc-500">
              No headlines today for {filterLabel}. Check back later.
            </p>
          )}

          {filterArticles.length > 0 && filteredArticles.length === 0 && followedTeams.length > 0 && (
            <p className="text-sm text-zinc-500">
              No headlines today mentioning your followed teams.
            </p>
          )}

          {filteredArticles.length > 0 && (
            <NewsList articles={filteredArticles} showLeague={isAllLeagues} />
          )}
        </section>

        {/* Tabs */}
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

        {/* Tab content */}
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

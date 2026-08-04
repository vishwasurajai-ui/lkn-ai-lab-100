"use client";

// ===============================
// v1.0.0 — European Soccer Hub (news feed UI)
// ===============================
// This version:
// - always-visible News section (mock data, today only)
// - Follow Teams bar (localStorage)
// - tab shell: Scores / Standings / Minigames (placeholders)
// - no backend / API wiring yet
// ===============================

import { useState, useEffect, useMemo } from "react";
import { LEAGUES, getLeague, type LeagueId } from "@/lib/leagues";
import { getMockNews, type NewsArticle } from "@/lib/mock-news";
import {
  getFollowedTeams,
  toggleFollowedTeam,
  type FollowedTeamsMap,
} from "@/lib/followed-teams";

type Tab = "scores" | "standings" | "minigames";

function articleMentionsTeam(article: NewsArticle, team: string): boolean {
  const haystack = `${article.title} ${article.description}`.toLowerCase();
  return haystack.includes(team.toLowerCase());
}

export default function Home() {
  // ===============================
  // CONFIG (CUSTOMIZE YOUR APP)
  // ===============================

  const APP_NAME = "Euro Soccer Hub";
  const BACKGROUND = "bg-zinc-950 text-white";
  const CARD_STYLE = "bg-zinc-900 border border-white/10 rounded-xl";
  const INPUT_STYLE = "bg-zinc-900 border border-white/10 text-white";
  const TAB_ACTIVE = "bg-emerald-600 text-white";
  const TAB_INACTIVE = "bg-zinc-800 text-zinc-400 hover:text-white";
  const CHIP_ACTIVE = "bg-emerald-600 text-white border-emerald-500";
  const CHIP_INACTIVE = "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500";

  // ===============================
  // STATE
  // ===============================

  const [league, setLeague] = useState<LeagueId>("Premier League");
  const [activeTab, setActiveTab] = useState<Tab>("scores");
  const [followedMap, setFollowedMap] = useState<FollowedTeamsMap>({});
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const leagueData = getLeague(league);
  const followedTeams = followedMap[league] ?? [];
  const articles = useMemo(() => getMockNews(league), [league, refreshKey]);

  // ===============================
  // FOLLOW TEAMS (localStorage)
  // ===============================

  useEffect(() => {
    setFollowedMap(getFollowedTeams());
  }, []);

  const handleToggleTeam = (team: string) => {
    const next = toggleFollowedTeam(league, team);
    setFollowedMap(next);
  };

  const filteredArticles = useMemo(() => {
    if (followedTeams.length === 0) return articles;
    return articles.filter((a) =>
      followedTeams.some((team) => articleMentionsTeam(a, team))
    );
  }, [articles, followedTeams]);

  // ===============================
  // UI
  // ===============================

  return (
    <main className={`min-h-screen ${BACKGROUND} flex justify-center pt-8 pb-12 px-4`}>
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{APP_NAME}</h1>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="text-xs text-zinc-400 hover:text-white"
          >
            Refresh
          </button>
        </div>

        {/* League selector */}
        <select
          value={league}
          onChange={(e) => {
            setLeague(e.target.value as LeagueId);
            setShowTeamPicker(false);
          }}
          className={`w-full p-3 rounded-lg mb-6 ${INPUT_STYLE}`}
        >
          {LEAGUES.map((l) => (
            <option key={l.name} value={l.name}>
              {l.name}
            </option>
          ))}
        </select>

        {/* News section — always visible */}
        <section className={`${CARD_STYLE} p-4 mb-6`}>
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-3">
            Today&apos;s News
          </h2>

          {articles.length === 0 && (
            <p className="text-sm text-zinc-400">
              No headlines today for {league}. Check back later.
            </p>
          )}

          {articles.length > 0 && filteredArticles.length === 0 && followedTeams.length > 0 && (
            <p className="text-sm text-zinc-400">
              No headlines today mentioning your followed teams.
            </p>
          )}

          {filteredArticles.length > 0 && (
            <ul className="space-y-4">
              {filteredArticles.map((article, i) => (
                <li key={i} className="border-b border-white/5 pb-3 last:border-none last:pb-0">
                  <div className="block group cursor-default">
                    <p className="font-medium text-sm group-hover:text-emerald-400 transition-colors">
                      {article.title}
                    </p>
                    {article.description && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                    <p className="text-xs text-zinc-500 mt-1">
                      {article.source} · {new Date(article.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Follow Teams */}
        <section className={`${CARD_STYLE} p-4 mb-6`}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
              Follow Teams
            </h2>
            <button
              onClick={() => setShowTeamPicker((v) => !v)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              {showTeamPicker ? "Hide" : "+ Add"}
            </button>
          </div>

          {followedTeams.length === 0 && !showTeamPicker && (
            <p className="text-sm text-zinc-400">
              Follow teams to filter news and scores.
            </p>
          )}

          {followedTeams.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
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
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {leagueData.teams.map((team) => {
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
            <p className="text-sm text-zinc-400 text-center">
              Scores coming in v2 — live fixtures for {league}.
            </p>
          )}
          {activeTab === "standings" && (
            <p className="text-sm text-zinc-400 text-center">
              Standings coming in v3 — league table for {league}.
            </p>
          )}
          {activeTab === "minigames" && (
            <p className="text-sm text-zinc-400 text-center">
              Minigames coming soon.
            </p>
          )}
        </section>

      </div>
    </main>
  );
}

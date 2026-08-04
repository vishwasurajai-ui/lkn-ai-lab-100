import type { LeagueId } from "./leagues";

const STORAGE_KEY = "soccer-followed-teams";

export type FollowedTeamsMap = Partial<Record<LeagueId, string[]>>;

export function getFollowedTeams(): FollowedTeamsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FollowedTeamsMap) : {};
  } catch {
    return {};
  }
}

export function setFollowedTeamsForLeague(
  league: LeagueId,
  teams: string[]
): FollowedTeamsMap {
  const current = getFollowedTeams();
  const next = { ...current, [league]: teams };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function toggleFollowedTeam(
  league: LeagueId,
  team: string
): FollowedTeamsMap {
  const current = getFollowedTeams()[league] ?? [];
  const next = current.includes(team)
    ? current.filter((t) => t !== team)
    : [...current, team];
  return setFollowedTeamsForLeague(league, next);
}

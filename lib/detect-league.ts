import { LEAGUES, type LeagueId } from "./leagues";

const LEAGUE_KEYWORDS: Record<LeagueId, string[]> = {
  "Premier League": [
    "premier league",
    "epl",
    "manchester united",
    "manchester city",
    "liverpool",
    "arsenal",
    "chelsea",
    "tottenham",
    "newcastle",
    "aston villa",
    "west ham",
    "everton",
    "fulham",
    "brighton",
    "crystal palace",
    "wolves",
    "bournemouth",
    "brentford",
    "nottingham forest",
  ],
  "La Liga": [
    "la liga",
    "real madrid",
    "barcelona",
    "atletico madrid",
    "athletic club",
    "real sociedad",
    "villarreal",
    "sevilla",
    "real betis",
  ],
  "Serie A": [
    "serie a",
    "juventus",
    "inter milan",
    "ac milan",
    "napoli",
    "roma",
    "lazio",
    "atalanta",
    "fiorentina",
  ],
  Bundesliga: [
    "bundesliga",
    "bayern munich",
    "bayern",
    "dortmund",
    "borussia dortmund",
    "rb leipzig",
    "leverkusen",
    "bayer leverkusen",
  ],
  "Ligue 1": [
    "ligue 1",
    "paris saint-germain",
    "psg",
    "marseille",
    "monaco",
    "lyon",
    "lille",
    "rennes",
  ],
};

export function detectLeague(title: string, description: string): LeagueId | null {
  const text = `${title} ${description}`.toLowerCase();
  let best: LeagueId | null = null;
  let bestScore = 0;

  for (const league of LEAGUES) {
    let score = 0;
    for (const keyword of LEAGUE_KEYWORDS[league.name]) {
      if (text.includes(keyword)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = league.name;
    }
  }

  return bestScore > 0 ? best : null;
}

export function isToday(isoDate: string): boolean {
  const d = new Date(isoDate);
  const now = new Date();
  return (
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate()
  );
}

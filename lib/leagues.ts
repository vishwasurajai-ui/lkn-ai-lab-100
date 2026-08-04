export type LeagueId =
  | "Premier League"
  | "La Liga"
  | "Serie A"
  | "Bundesliga"
  | "Ligue 1";

export type LeagueFilter = "ALL" | LeagueId;

export const ALL_LEAGUES_OPTION = "ALL" as const;

export type League = {
  name: LeagueId;
  apiFootballId: number;
  searchQuery: string;
  teams: string[];
};

export const LEAGUES: League[] = [
  {
    name: "Premier League",
    apiFootballId: 39,
    searchQuery: "Premier League soccer",
    teams: [
      "Arsenal",
      "Aston Villa",
      "Bournemouth",
      "Brentford",
      "Brighton",
      "Chelsea",
      "Crystal Palace",
      "Everton",
      "Fulham",
      "Ipswich",
      "Leicester",
      "Liverpool",
      "Manchester City",
      "Manchester United",
      "Newcastle",
      "Nottingham Forest",
      "Southampton",
      "Tottenham",
      "West Ham",
      "Wolves",
    ],
  },
  {
    name: "La Liga",
    apiFootballId: 140,
    searchQuery: "La Liga soccer",
    teams: [
      "Alaves",
      "Athletic Club",
      "Atletico Madrid",
      "Barcelona",
      "Betis",
      "Celta Vigo",
      "Espanyol",
      "Getafe",
      "Girona",
      "Las Palmas",
      "Leganes",
      "Mallorca",
      "Osasuna",
      "Rayo Vallecano",
      "Real Madrid",
      "Real Sociedad",
      "Sevilla",
      "Valencia",
      "Valladolid",
      "Villarreal",
    ],
  },
  {
    name: "Serie A",
    apiFootballId: 135,
    searchQuery: "Serie A soccer",
    teams: [
      "Atalanta",
      "Bologna",
      "Cagliari",
      "Como",
      "Empoli",
      "Fiorentina",
      "Genoa",
      "Inter",
      "Juventus",
      "Lazio",
      "Lecce",
      "Milan",
      "Monza",
      "Napoli",
      "Parma",
      "Roma",
      "Torino",
      "Udinese",
      "Venezia",
      "Verona",
    ],
  },
  {
    name: "Bundesliga",
    apiFootballId: 78,
    searchQuery: "Bundesliga soccer",
    teams: [
      "Augsburg",
      "Bayern Munich",
      "Bochum",
      "Dortmund",
      "Ein Frankfurt",
      "Freiburg",
      "Heidenheim",
      "Hoffenheim",
      "Holstein Kiel",
      "Leverkusen",
      "Mainz",
      "Gladbach",
      "RB Leipzig",
      "St Pauli",
      "Stuttgart",
      "Union Berlin",
      "Werder Bremen",
      "Wolfsburg",
    ],
  },
  {
    name: "Ligue 1",
    apiFootballId: 61,
    searchQuery: "Ligue 1 soccer",
    teams: [
      "Angers",
      "Auxerre",
      "Brest",
      "Le Havre",
      "Lens",
      "Lille",
      "Lyon",
      "Marseille",
      "Monaco",
      "Montpellier",
      "Nantes",
      "Nice",
      "Paris Saint-Germain",
      "Reims",
      "Rennes",
      "Saint-Etienne",
      "Strasbourg",
      "Toulouse",
    ],
  },
];

export function getLeague(name: LeagueId): League {
  return LEAGUES.find((l) => l.name === name) ?? LEAGUES[0];
}

export function getAllTeams(): string[] {
  return LEAGUES.flatMap((l) => l.teams);
}

export function getLeagueForTeam(team: string): LeagueId | null {
  const league = LEAGUES.find((l) => l.teams.includes(team));
  return league?.name ?? null;
}

import type { LeagueId } from "./leagues";

export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
};

function todayIso(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const MOCK_BY_LEAGUE: Record<LeagueId, NewsArticle[]> = {
  "Premier League": [
    {
      title: "Liverpool extend lead with late winner at Anfield",
      description: "Mohamed Salah scored in the 88th minute as Liverpool beat a stubborn mid-table side.",
      url: "#",
      publishedAt: todayIso(9, 15),
      source: "BBC Sport",
    },
    {
      title: "Arsenal injury update ahead of North London derby",
      description: "Mikel Arteta confirmed two starters are doubts for the weekend clash with Tottenham.",
      url: "#",
      publishedAt: todayIso(11, 40),
      source: "Sky Sports",
    },
    {
      title: "Manchester City rotate squad for cup tie",
      description: "Pep Guardiola names a mixed XI with several first-team regulars rested.",
      url: "#",
      publishedAt: todayIso(14, 5),
      source: "The Athletic",
    },
  ],
  "La Liga": [
    {
      title: "Barcelona teenager shines in training before El Clasico",
      description: "The 18-year-old midfielder impressed staff and could feature on the bench.",
      url: "#",
      publishedAt: todayIso(8, 30),
      source: "Marca",
    },
    {
      title: "Real Madrid confirm return date for key defender",
      description: "Carlo Ancelotti says the center-back is ahead of schedule in recovery.",
      url: "#",
      publishedAt: todayIso(10, 20),
      source: "AS",
    },
    {
      title: "Atletico Madrid set to recall loan star",
      description: "Diego Simeone wants the winger back to boost depth on the flanks.",
      url: "#",
      publishedAt: todayIso(13, 0),
      source: "ESPN",
    },
  ],
  "Serie A": [
    {
      title: "Inter Milan close in on top spot after dominant win",
      description: "A 3-0 home victory keeps Inter within two points of the league leaders.",
      url: "#",
      publishedAt: todayIso(9, 0),
      source: "Gazzetta",
    },
    {
      title: "Juventus midfielder linked with summer move",
      description: "Reports in Italy suggest Premier League clubs are monitoring the situation.",
      url: "#",
      publishedAt: todayIso(12, 15),
      source: "Sky Italia",
    },
    {
      title: "Milan boss praises Roma performance after draw",
      description: "Stefano Pioli called it a fair result between two sides chasing Europe.",
      url: "#",
      publishedAt: todayIso(15, 30),
      source: "Corriere",
    },
  ],
  Bundesliga: [
    {
      title: "Bayern Munich cruise past relegation candidate",
      description: "Harry Kane netted twice as Bayern moved clear at the summit.",
      url: "#",
      publishedAt: todayIso(10, 0),
      source: "Kicker",
    },
    {
      title: "Dortmund fans react to comeback victory",
      description: "Edin Terzic's side scored twice in the final 15 minutes to steal three points.",
      url: "#",
      publishedAt: todayIso(11, 45),
      source: "Bild",
    },
    {
      title: "RB Leipzig star named player of the month",
      description: "The forward has five goals in four games during a strong run of form.",
      url: "#",
      publishedAt: todayIso(14, 20),
      source: "Bundesliga.com",
    },
  ],
  "Ligue 1": [
    {
      title: "Paris Saint-Germain unveil new signing at Parc des Princes",
      description: "The club presented its winter arrival to supporters before kickoff.",
      url: "#",
      publishedAt: todayIso(9, 30),
      source: "L'Équipe",
    },
    {
      title: "Monaco climb into Champions League places",
      description: "A clean sheet and late goal moved Monaco above Marseille on goal difference.",
      url: "#",
      publishedAt: todayIso(12, 0),
      source: "RMC Sport",
    },
    {
      title: "Lyon search for consistency after mixed week",
      description: "Paulo Fonseca wants his squad to string together back-to-back wins.",
      url: "#",
      publishedAt: todayIso(16, 10),
      source: "France 24",
    },
  ],
};

export function getMockNews(league: LeagueId): NewsArticle[] {
  return MOCK_BY_LEAGUE[league] ?? [];
}

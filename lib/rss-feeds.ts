export type RssFeed = {
  url: string;
  source: string;
};

export const RSS_FEEDS: RssFeed[] = [
  {
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
    source: "BBC Sport",
  },
  {
    url: "https://www.espn.com/espn/rss/soccer/news",
    source: "ESPN",
  },
  {
    url: "https://www.theguardian.com/football/rss",
    source: "The Guardian",
  },
];

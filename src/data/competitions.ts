export type Competition = {
  slug: string;
  title: string;
  /** Result shown as a glowing badge: the rank, then the official title. */
  placement: { rank: string; title: string };
  date: string;
  location: string;
  organisers: string[];
  supporters?: string[];
  teamSize: number;
  /** The entry the team built, shown as the headline of the card. */
  entry: string;
  summary: string;
  stats?: { value: string; label: string }[];
  highlights: string[];
  stack: string[];
  repo?: string;
  /** Index into `photos` used as the card thumbnail; defaults to the first. */
  thumbnail?: number;
  photos?: { src: string; alt: string; caption: string; width: number; height: number }[];
};

// Newest first. Add new competitions at the top.
export const competitions: Competition[] = [
  {
    slug: "nexgen-tech-talent-day",
    title: "NexGen Tech Talent Day Hackathon",
    placement: { rank: "2nd place", title: "1st Runner Up" },
    date: "31 July 2026",
    location: "Singapore",
    organisers: ["IMDA", "NTUC e2i", "AWS"],
    supporters: ["Powered by Kiro", "Supported by NTUC Infocomm & Media Cluster"],
    teamSize: 4,
    entry: "ATM Cash Replenishment Planner",
    summary:
      "In a team of four, we took on UOB's ATM cash logistics problem: forecast how much cash each of 350 ATMs will need tomorrow, then plan the replenishment trips that keep every machine stocked without sending out more trucks than necessary.",
    stats: [
      { value: "31%", label: "lower forecast error than a same-day-last-week benchmark (17.5% MAPE)" },
      { value: "13.2%", label: "fewer replenishment trips than the manual baseline in a 30-day backtest" },
      { value: "0", label: "cash-outs in the backtest" },
    ],
    highlights: [
      "A scikit-learn gradient-boosting model with lag, payday and holiday features forecasts next-day cash withdrawals for UOB's 350 ATMs.",
      "A replenishment schedule respects the 190-trip daily cap, a P0/P1/P2 priority mix and a 14-day rule.",
      "The backtest ran on simulated data and the whole planner was demoed live in a Streamlit app.",
    ],
    stack: ["Python", "pandas", "NumPy", "scikit-learn", "matplotlib", "Streamlit"],
    repo: "https://github.com/secbest/hackathon_aws",
    photos: [
      {
        src: "/images/nexgen_aws_team.webp",
        alt: "The team of four posing in front of a large AWS sign at the AWS Singapore office, one holding the runner-up envelope",
        caption: "With the team at AWS Singapore",
        width: 1280,
        height: 960,
      },
      {
        src: "/images/nexgen_results.webp",
        alt: "The team lined up beside a screen reading 1st Runner Up, Team 11, at the NexGen Tech Talent Day Hackathon",
        caption: "1st Runner Up announced: Team 11",
        width: 800,
        height: 1066,
      },
      {
        src: "/images/nexgen_presenting.webp",
        alt: "Teammates presenting at a podium with a dashboard on the screen behind them",
        caption: "Presenting the planner to the judges",
        width: 480,
        height: 853,
      },
      {
        src: "/images/nexgen_certificate.webp",
        alt: "Certificate presented to Jasper Teo for attaining 1st Runner Up in the NexGen Tech Talent Day Hackathon on 31 July 2026, signed by Valerie Leong of Amazon Web Services",
        caption: "Certificate: 1st Runner Up",
        width: 1087,
        height: 772,
      },
    ],
  },
];

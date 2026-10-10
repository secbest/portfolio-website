export type HobbyIconName = "gym" | "cycling" | "swimming" | "badminton" | "baseball" | "reading" | "gaming" | "music";

// All wording below is a draft: replace it with your own.
export const beyondCode = {
  label: "// exit 0",
  heading: "Life Outside the Terminal",
  sports: {
    title: "Staying Active",
    body: [
      "Sport keeps me balanced. Between gym sessions, cycling, swimming, badminton and baseball, there's always a way to move, compete and clear my head.",
      "It's where I practise the habits I bring to code: consistency, patience and showing up even when it's hard.",
    ],
    items: [
      { name: "Gym", icon: "gym" },
      { name: "Cycling", icon: "cycling" },
      { name: "Swimming", icon: "swimming" },
      { name: "Badminton", icon: "badminton" },
      { name: "Baseball", icon: "baseball" },
    ] as { name: string; icon: HobbyIconName }[],
  },
  reading: {
    title: "Always Reading",
    body: [
      "A good book is how I slow down and learn from other people's thinking.",
    ],
    /** Add titles here to fill the bookshelf and show a "favourite reads" card. */
    favourites: [] as string[],
  },
  gaming: {
    title: "Play & Strategy",
    body: [
      "Gaming is where I unwind and think in systems: strategy, co-op, and the occasional late night.",
    ],
    /** Add games here to show a "favourite games" card. */
    favourites: [] as string[],
  },
  music: {
    title: "Music on Repeat",
    body: [
      "Happy, wound up, winding down or locked in, there's an album for it. Music is how I express what I can't always say.",
      "Fun fact: I listen to albums front to back, no shuffle. This is what I've been playing.",
    ],
  },
};

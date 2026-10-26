export type HobbyIconName = "gym" | "cycling" | "swimming" | "badminton" | "baseball" | "music";

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
  music: {
    title: "Music on Repeat",
    body: [
      "Happy, wound up, winding down or locked in, there's an album for it. Music is how I express what I can't always say.",
      "Fun fact: I mostly listen to albums front to back, no shuffle. This is what I've been playing.",
    ],
  },
};

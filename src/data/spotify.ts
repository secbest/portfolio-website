// Numbers Spotify's API can't give us. Fill them in by hand, or run
//   node scripts/spotify-history.mjs <folder-with-your-export> <year>
// which rewrites this file from your "Extended streaming history" download.
// Anything left as null is hidden.
export const spotifyHistory: {
  year: number;
  minutesListened: number | null;
  mostPlayed: { name: string; artist: string; plays: number } | null;
  /** Minutes listened in each hour of the day, index 0 = midnight (Singapore time). */
  byHour: number[] | null;
} = {
  year: 2026,
  minutesListened: null,
  mostPlayed: null,
  byHour: null,
};

// One-time helper: authorise your Spotify app and print a refresh token.
// Usage: node scripts/spotify-auth.mjs
// Needs SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local, and
// http://127.0.0.1:8888/callback added as a Redirect URI in the Spotify dashboard.
import { readFileSync } from "node:fs";
import { createServer } from "node:http";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const id = env.SPOTIFY_CLIENT_ID;
const secret = env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local first.");
  process.exit(1);
}

const redirect = "http://127.0.0.1:8888/callback";
const scope =
  "user-top-read user-read-recently-played user-read-currently-playing user-library-read playlist-read-private";
const url =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({ client_id: id, response_type: "code", redirect_uri: redirect, scope }).toString();

const server = createServer(async (req, res) => {
  const u = new URL(req.url, "http://127.0.0.1:8888");
  if (u.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const code = u.searchParams.get("code");
  if (!code) {
    res.end("Authorisation failed: " + (u.searchParams.get("error") ?? "no code"));
    return;
  }
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
  });
  const data = await r.json();
  res.end(data.refresh_token ? "Done! Check your terminal, then close this tab." : "Token exchange failed: " + JSON.stringify(data));
  if (data.refresh_token) {
    console.log("\nAdd this line to .env.local (and to Vercel):\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
  } else {
    console.error(data);
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => {
  console.log("Open this link in your browser and approve access:\n\n" + url + "\n");
});

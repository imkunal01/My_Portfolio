/**
 * Spotify Refresh Token Generator
 * ─────────────────────────────────────────────────────────────────────────────
 * Run this once to get your refresh token:
 *   npm run spotify-token   (from backend directory)
 *   OR
 *   node utils/spotifyTokenHelper.js
 *
 * Prerequisites:
 *  1. Go to https://developer.spotify.com/dashboard
 *  2. Create an app (or use existing)
 *  3. In the app settings → Redirect URIs → Add: http://localhost:3333/callback
 *  4. Copy the Client ID and Client Secret into your backend/.env file
 *  5. Run this script
 * ─────────────────────────────────────────────────────────────────────────────
 */

const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const { URL, URLSearchParams } = require("url");

// Resolve backend/.env reliably regardless of execution directory
const possibleEnvPaths = [
  path.join(__dirname, "../.env"),
  path.join(process.cwd(), ".env"),
  path.join(process.cwd(), "backend/.env"),
];

let envPath = possibleEnvPaths[0];
for (const p of possibleEnvPaths) {
  if (fs.existsSync(p)) {
    envPath = p;
    break;
  }
}

require("dotenv").config({ path: envPath });

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:3333/callback";
const SCOPE = "user-read-currently-playing user-read-playback-state user-modify-playback-state";
const PORT = 3333;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("\n❌  SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in backend/.env first.\n");
  console.error(`Loaded env file path: ${envPath}`);
  console.error("Current SPOTIFY_CLIENT_ID:", CLIENT_ID ? "✓ Set" : "✗ Missing");
  console.error("Current SPOTIFY_CLIENT_SECRET:", CLIENT_SECRET ? "✓ Set" : "✗ Missing\n");
  process.exit(1);
}

const authUrl =
  `https://accounts.spotify.com/authorize?` +
  new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
  }).toString();

console.log("\n🎵  Spotify Refresh Token Generator");
console.log("────────────────────────────────────");
console.log("📌 REQUIRED SPOTIFY DASHBOARD SETUP:");
console.log("   1. Go to https://developer.spotify.com/dashboard");
console.log("   2. Open your App -> Settings");
console.log("   3. Under 'Redirect URIs', add EXACTLY:");
console.log(`      ${REDIRECT_URI}`);
console.log("   4. Click 'Add' and then click 'Save' at the bottom!\n");
console.log("────────────────────────────────────");
console.log("1. Open this URL in your browser:\n");
console.log("   " + authUrl);
console.log("\n2. Log in and authorize the app.");
console.log("3. You'll be redirected back here automatically.\n");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }

  const code = url.searchParams.get("code");
  const errorParam = url.searchParams.get("error");

  if (errorParam) {
    console.error(`\n❌  Authorization failed from Spotify: ${errorParam}`);
    if (errorParam === "server_error") {
      console.error("💡  TROUBLESHOOTING 'server_error':");
      console.error("   1. Open the URL in an INCOGNITO / PRIVATE browser window.");
      console.error("   2. In Spotify Dashboard -> Users and Access -> Add your Spotify email.");
      console.error("   3. Check that Client ID & Client Secret in backend/.env match your Spotify app.\n");
    }
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(`
      <html><body style="font-family:sans-serif;padding:40px;background:#0a0a0a;color:#fff;line-height:1.6;">
        <h2 style="color:#ff5555;">❌ Spotify Authorization Error</h2>
        <p>Spotify returned: <code>${errorParam}</code></p>
        ${
          errorParam === "server_error"
            ? `
            <div style="background:#1a1a1a;padding:16px;border-radius:8px;border-left:4px solid #ffaa00;margin-top:20px;">
              <h3 style="margin-top:0;color:#ffaa00;">💡 How to fix this:</h3>
              <ol>
                <li><strong>Try Incognito Mode:</strong> Open the auth URL in an Incognito / Private tab (stale Spotify cookies cause this).</li>
                <li><strong>Users and Access:</strong> Go to <a href="https://developer.spotify.com/dashboard" target="_blank" style="color:#1db954;">Spotify Dashboard</a> &rarr; your App &rarr; <strong>Users and Access</strong> and add your Spotify account email.</li>
                <li><strong>Check Credentials:</strong> Verify <code>SPOTIFY_CLIENT_ID</code> and <code>SPOTIFY_CLIENT_SECRET</code> in <code>backend/.env</code>.</li>
              </ol>
            </div>
          `
            : ""
        }
      </body></html>
    `);
    setTimeout(() => {
      server.close();
      process.exit(1);
    }, 2000);
    return;
  }

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Missing code parameter");
    return;
  }

  // Exchange code for tokens
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  }).toString();

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const tokenReq = https.request(
    {
      hostname: "accounts.spotify.com",
      path: "/api/token",
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    (tokenRes) => {
      let data = "";
      tokenRes.on("data", (chunk) => (data += chunk));
      tokenRes.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.refresh_token) {
            console.log("\n✅  Success! Refresh token retrieved successfully.");

            // Automatically update backend/.env
            let updatedEnv = false;
            try {
              if (fs.existsSync(envPath)) {
                let envContent = fs.readFileSync(envPath, "utf8");
                if (envContent.match(/^SPOTIFY_REFRESH_TOKEN=/m)) {
                  envContent = envContent.replace(
                    /^SPOTIFY_REFRESH_TOKEN=.*$/m,
                    `SPOTIFY_REFRESH_TOKEN=${json.refresh_token}`
                  );
                } else {
                  envContent += `\nSPOTIFY_REFRESH_TOKEN=${json.refresh_token}\n`;
                }
                fs.writeFileSync(envPath, envContent, "utf8");
                updatedEnv = true;
                console.log(`💾  Automatically saved to ${envPath}`);
              }
            } catch (e) {
              console.warn("⚠️  Could not automatically update .env file:", e.message);
            }

            console.log("────────────────────────────────────");
            console.log(`SPOTIFY_REFRESH_TOKEN=${json.refresh_token}`);
            console.log("────────────────────────────────────\n");

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
              <html><body style="font-family:sans-serif;padding:40px;background:#0a0a0a;color:#fff;">
                <h2 style="color:#1db954;">✅ Refresh Token Generated!</h2>
                ${updatedEnv ? "<p style='color:#4caf50;'><strong>Saved automatically to your backend/.env file!</strong></p>" : ""}
                <p>Your Spotify Refresh Token is:</p>
                <code style="background:#1a1a1a;padding:12px;display:block;border-radius:8px;font-size:14px;word-break:break-all;color:#1db954;">
                  SPOTIFY_REFRESH_TOKEN=${json.refresh_token}
                </code>
                <p style="color:#aaa;margin-top:20px;">You can close this tab and stop the helper script.</p>
              </body></html>
            `);
            setTimeout(() => {
              server.close();
              process.exit(0);
            }, 3000);
          } else {
            console.error("❌  Failed to get refresh token from Spotify:", json);
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end(`
              <html><body style="font-family:sans-serif;padding:40px;background:#0a0a0a;color:#fff;">
                <h2 style="color:#ff5555;">❌ Failed to get refresh token</h2>
                <pre style="background:#1a1a1a;padding:12px;border-radius:8px;color:#ff8888;">${JSON.stringify(json, null, 2)}</pre>
              </body></html>
            `);
            setTimeout(() => {
              server.close();
              process.exit(1);
            }, 3000);
          }
        } catch (parseErr) {
          console.error("❌ Error parsing response from Spotify:", parseErr, data);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Invalid response from Spotify");
          server.close();
          process.exit(1);
        }
      });
    }
  );

  tokenReq.on("error", (err) => {
    console.error("Request error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Network error connecting to Spotify");
    server.close();
    process.exit(1);
  });

  tokenReq.write(body);
  tokenReq.end();
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌  Port ${PORT} is already in use by another process.`);
    console.error(`    Please stop the process using port ${PORT} and try again.\n`);
  } else {
    console.error("\n❌  Server error:", err.message);
  }
  process.exit(1);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`🔌  Listening on http://127.0.0.1:${PORT}/callback for the OAuth callback...\n`);
});


# GXY Weather — Setup Guide (GitHub Direct Publish)

The **GXY Weather** page shows the live in-game forecast from the Seasonal
Forecast mod. With v0.4, the mod commits `forecast.json` **straight to your
GitHub repo** over HTTPS — no FTP, no external script, no third-party host.

## How it works

```
Seasonal Forecast mod (on exaroton)            GitHub Pages
┌──────────────────────────────────┐           ┌──────────────────┐
│ On server start + each MC day:    │           │ weather.html     │
│  • builds forecast.json           │ ──HTTPS── │ fetches          │
│  • commits it to your repo via    │   PUT     │ forecast.json    │
│    the GitHub Contents API        │  ───────► │ and displays it  │
└──────────────────────────────────┘           └──────────────────┘
```

The mod runs Java, so it can make the web request itself. GitHub Pages then
serves the committed file, and the website reads it. Nothing else required.

## One-time setup

### 1. Create a GitHub token (fine-grained, minimal scope)
GitHub → Settings → Developer settings → **Fine-grained personal access tokens**
→ Generate new token:
- **Repository access:** Only select repositories → pick your site repo
- **Permissions:** Repository permissions → **Contents → Read and write**
- Nothing else. Copy the token (starts with `github_pat_`).

> Keep this token private. It goes only in the mod config on the server — never
> in the website, never in a public place. Scoped this way, the worst case if it
> leaked is edits to this one repo.

### 2. Install the mod on the server
Upload `mod/seasonalforecast-0.4.jar` to your exaroton server's `mods` folder.
Requires **NeoForge 1.21.1** + **Serene Seasons** (and **Weather2** for visuals).

### 3. Fill in the mod config
After running the server once, edit the Seasonal Forecast config file
(in the server's `config/` folder, e.g. `config/seasonalforecast-common.toml` —
exaroton shows this in its config panel). Set:

```
[github]
githubEnabled = true
githubToken = "github_pat_xxxxxxxxxxxx"     # the token from step 1
githubRepo = "YOUR_USERNAME/YOUR_USERNAME.github.io"   # owner/name
githubPath = "businesses/gxy-newspaper/forecast.json"  # <-- matches the website
githubBranch = "main"
githubCommitMessage = "Update GXY Weather forecast"
```

**Important:** `githubPath` must be exactly `businesses/gxy-newspaper/forecast.json`
so it overwrites the file the website already reads. Don't change it unless you
also tell me to repoint the page.

### 4. Restart and check
Restart the server. On start (and then each Minecraft day) the mod commits the
forecast. Check your repo — you should see a new commit updating
`businesses/gxy-newspaper/forecast.json`. Within a minute, the GXY Weather page
goes live (the status dot turns green).

## Good to know
- **Commit frequency:** the mod commits once per in-game day, so your repo will
  get frequent small commits. Harmless, just expect lots of "Update GXY Weather
  forecast" entries. If that bugs you, ask to have it commit less often.
- **Until it's connected,** the page shows a placeholder with a grey status dot
  and "live forecast not connected yet." Nothing is broken — it just hasn't
  received a real forecast.json yet.
- **The sample forecast.json** currently in the repo is just placeholder data so
  the page has something to show. The mod will overwrite it with real data.

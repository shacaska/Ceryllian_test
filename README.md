# Ceryllian Duel: test build

A playable prototype of the opening duel from **Ceryllian**, a solo roguelite board game in development. You are Sabbialt, an infiltrator slipping into the island city of Ceryllian. Between you and the next district stands the Lamplighter, a watchman with a hooked lantern-pole.

Each round you secretly commit two cards, one for each beat, then his card flips and the beats play out in speed order. Your hand is both your stamina and your life: every card you play is spent, wounds cost you cards for good, and an empty hand means he finishes you. His wounds turn his cards to their Nightmare side.

## Play

- **Online:** https://shacaska.github.io/Ceryllian_test/ (once GitHub Pages is turned on, see below). This works on phones too.
- **Offline:** download `index.html` and open it in any desktop browser, or in Chrome on Android. iPhones usually only preview a downloaded HTML file without running it, so use the online link there.

The **Rules** tab in the game explains everything in about three minutes. Type your name on the **Playtests** tab so your fights are easy to spot in the shared log.

## Turn on the online version

In this repository on GitHub: **Settings → Pages → Build and deployment**. Set **Source** to *Deploy from a branch*, choose **main** and **/ (root)**, then **Save**. The game is live at the link above about a minute later.

## Shared playtest log

Every finished fight can be logged to one Google Sheet, so everyone's play shows up on the Playtests tab for every player. Setting it up takes about five minutes and only needs doing once:

1. Go to [script.google.com](https://script.google.com) and click **New project**.
2. Delete what's in the editor, then paste in the contents of [`shared-log/Code.gs`](shared-log/Code.gs). Save.
3. Click **Deploy → New deployment**. Under **Select type**, choose **Web app**. Set **Execute as** to *Me* and **Who has access** to *Anyone*. Click **Deploy**.
4. Authorize it when asked. Google warns that the app isn't verified because you wrote it yourself: choose **Advanced → Go to (project name)**.
5. Copy the **Web app URL**. It ends in `/exec`.
6. In `index.html`, find the line `var SHARED_LOG_URL = '';` and paste the URL between the quotes. Commit the change.

The first fight creates a sheet called *Ceryllian Duel playtest log* in your Google Drive. One row is one fight, with the full record in the last column. To find the sheet, open the web app URL with `?sheet=1` on the end.

Until the URL is filled in, fights stay on each player's device. Players can still send them on with **Copy my fight log** on the Playtests tab.

### If fights aren't showing up

Open the web app URL in a private or incognito window. It should show `{"fights":[...]}`, and opening it creates the sheet if there isn't one yet. If it shows something else:

- **A Google sign-in page, or "You need access":** the web app isn't public. In the script editor, go to **Deploy → Manage deployments**, click the pencil, set **Who has access** to *Anyone* and **Version** to *New version*, then **Deploy**. The URL stays the same.
- **"Authorization is required to perform that action":** in the editor, choose `doGet` in the toolbar's function menu and click **Run**. Allow access when asked, then reload the URL.
- **"Script function not found: doGet":** the code wasn't saved before deploying. Save it, then deploy a new version as in the first fix.

The script editor's **Executions** page, in the left sidebar, lists every request with any error. Code changes only reach the live URL once you deploy a new version. Fights that didn't get through stay on each player's device and are sent again the next time the log can be reached.

Good to know:
- The web app URL ends up in the public game file, so anyone with the game can add fights to the log. That's fine for a playtest. If it ever gets spammed, deploy a new version and change the URL.
- The only thing logged about a player is the name they type and a random device ID.

## Files

- `index.html`: the whole game in one file, with no build step and no dependencies apart from Google Fonts.
- `shared-log/Code.gs`: the Google Apps Script behind the shared playtest log.

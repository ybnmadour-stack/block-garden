# Block Garden

A free experimental block puzzle for Android, iPhone, and desktop. Built with browser JavaScript and CSS, with no libraries, accounts, ads, or build dependencies. Inspired by block-placement puzzles, with original branding and visuals.

## Run in VS Code

Open this folder in VS Code. In its terminal run `npm start`, then open http://localhost:5173. Node.js must be installed. Run `npm test` to check the game rules.

To try on a phone, connect the phone and computer to the same trusted Wi-Fi. Run `ipconfig` on Windows, find the Wi-Fi IPv4 address, and open `http://YOUR-PC-IP:5173` on the phone. Windows may request firewall access; allow private networks only. Local HTTP phone testing supports gameplay, but installation and offline caching require HTTPS.

## Publish free with GitHub Pages

1. Create a public GitHub repository, then use VS Code Source Control to initialize this folder and publish it to that repository. The source code will be public.
2. In the GitHub repository, open Settings > Pages. Choose Deploy from a branch, select your published branch and /(root), then save.
3. Open the HTTPS address GitHub provides on either phone.
4. On iPhone, use Safari's Share menu > Add to Home Screen. On Android, use the browser's Install app or Add to Home screen option where supported. Installation labels and eligibility vary by browser; bookmark or home-screen access is available even if an installation prompt is absent.

After the first successful cache, the game can load offline. Best score is saved on each device/browser; active games are not saved. SVG app icons are supported differently across phones, so some may use a generated icon. No app-store submission is included.

## Play

Choose difficulty on Home before starting either mode. Easy draws only shapes of up to four squares that currently fit. Hard draws larger shapes of four, six, or nine squares without a fitting-piece guarantee. Impossible uses only awkward shapes of five to nine squares, with no rescue pieces. Every mode/difficulty pair has its own best-score record. Earlier pre-difficulty scores stay stored but are not mixed into these new records. Changing the home selector does not alter a continued round.

The home screen lets you choose Classic or the five-minute challenge. Home preserves your current round within this tab; Continue returns to it. Reloading closes the current round. Choosing a mode starts a new round. The timed clock keeps running in menus.

Settings offers Daylight glass blue or Starlight dark glass with a starry sky, animation preferences (device setting, full, reduced), and an option to lift touch-dragged blocks above your finger. Preferences are saved on this browser.

Choose Classic for untimed play, or 5-minute challenge to start a five-minute countdown immediately. Switching modes or restarting begins a new round. The clock keeps running while the tab is in the background. Time running out or having no legal placements ends the challenge. Each mode saves its own best score on this browser; there is no shared online leaderboard.

Drag a piece onto the board, or select a piece then tap the board. Your chosen square anchors the top-left of its shape. Complete rows or columns to clear them. Each placed square earns one point, each cleared line earns 20, and each extra line in a move earns 10 bonus points. Use all three pieces to receive a fresh set. The game ends when none of the remaining pieces fit.

When updating offline assets, increment the cache version in sw.js. No paid service or API is required to run or host this game using public GitHub Pages.

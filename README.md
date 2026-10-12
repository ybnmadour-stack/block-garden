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

Drag a piece onto the board, or select a piece then tap the board. Your chosen square anchors the top-left of its shape. Complete rows or columns to clear them. Each placed square earns one point, each cleared line earns 20, and each extra line in a move earns 10 bonus points. Use all three pieces to receive a fresh set. The game ends when none of the remaining pieces fit.

When updating offline assets, increment the cache version in sw.js. No paid service or API is required to run or host this game using public GitHub Pages.

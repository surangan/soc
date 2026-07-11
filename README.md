# Faculty AI Build Challenge Website

A self-contained static website for the NUS Computing Faculty Retreat Hackathon and its 90-minute Faculty AI Build Challenge.

## Files

- `index.html` — page content and structure
- `styles.css` — visual design and responsive layout
- `event-config.js` — 17 placeholder project rows and optional external data links
- `script.js` — timer, filters, copy buttons and project gallery loading

## Customise before the event

Open `event-config.js` and update the 17 `fallbackProjects` rows when final project details are ready. Each row supports:

- `team`
- `title`
- `url`
- `image`
- `pitch`

The current gallery intentionally uses dummy images, placeholder titles and dummy text.

You may also update:

- event title and retreat name
- project ideas
- judging percentages
- prize description
- tool list
- schedule timings

## Run locally

Double-click `index.html`, or run a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish

This site can be deployed directly to:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- any ordinary web server

No build step or backend is required.

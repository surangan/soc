# Faculty AI Build Challenge Website

A self-contained static website for a 90-minute faculty AI hackathon.

## Files

- `index.html` — page content and structure
- `styles.css` — visual design and responsive layout
- `script.js` — timer, filters and copy buttons

## Customise before the event

Open `index.html` and replace the two placeholder links in the **Share your prototype** section:

```html
<a class="button disabled-link" href="#">Open submission document</a>
<a class="button button-secondary disabled-link" href="#">Open voting form</a>
```

Replace `#` with your Google Doc and Google Form URLs. You can then remove the `disabled-link` class if desired.

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

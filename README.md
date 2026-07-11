# Faculty AI Build Challenge Website

A self-contained static website for the NUS Computing Faculty Retreat Hackathon and its 90-minute Faculty AI Build Challenge.

## Files

- `index.html` — page content and structure
- `styles.css` — visual design and responsive layout
- `event-config.js` — Google Sheet links and 17 placeholder project rows
- `script.js` — timer, filters, copy buttons and project gallery loading

## Customise before the event

Open `event-config.js` and replace the placeholder links:

```js
projectSheetCsvUrl: "",
```

Recommended project Sheet columns:

- `Team`
- `Title` or `Project Title`
- `Image URL`
- `Description`
- `Project URL`

To power the gallery from Google Sheets:

1. Create a Google Sheet with the columns above.
2. Choose **File > Share > Publish to web**.
3. Publish the project tab as CSV.
4. Paste the CSV URL into `projectSheetCsvUrl`.

For voting, create a Google Form that collects names or NUS emails and asks voters to choose a project. If you want the site to display vote totals, link the Form responses to a Sheet, publish the response Sheet as CSV, and paste that CSV URL into `voteResultsCsvUrl`.

Optional: if you use a pre-filled Google Form field for the selected project, paste the form URL into `votingFormUrl` and its entry ID, such as `entry.123456789`, into `votingFormProjectField`. Each project card will then show a vote button with that project pre-filled.

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

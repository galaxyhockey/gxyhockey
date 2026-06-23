# How to Post Breaking News

The breaking news banner appears at the top of **every page** on the site
(except the login screen). It pulses red to grab attention and links to the
breaking news article.

## To POST breaking news

Edit two files:

### 1. `breaking.json` (at the SITE ROOT — same folder as the login index.html)
```json
{
  "active": true,
  "label": "BREAKING NEWS",
  "headline": "Your headline here",
  "summary": "A one-line summary that shows in the banner.",
  "link": "businesses/gxy-newspaper/articles/breaking.html",
  "updated": "2026-06-22T18:00:00Z"
}
```
- `active`: `true` to show the banner, `false` to hide it everywhere.
- `headline` / `summary`: shown in the banner AND auto-filled into the article.
- `updated`: change this timestamp each time you post something new — it makes
  the banner re-appear for people who dismissed the previous one.
- `link`: leave as-is to point at the breaking article.

### 2. `businesses/gxy-newspaper/articles/breaking.html`
Edit the story body — find the comment marked `EDIT THE STORY BODY BELOW`
and rewrite the paragraphs (swap the image if you want). The headline, summary,
and date fill in automatically from breaking.json.

## To CLEAR breaking news
Set `"active": false` in `breaking.json`. The banner disappears site-wide.

## Notes
- Visitors can dismiss the banner with the X button; it stays gone for them
  until you post something new (change the `updated` timestamp).
- Updates appear within a minute of pushing to GitHub.
- If breaking.json is missing or active is false, the banner simply stays hidden.

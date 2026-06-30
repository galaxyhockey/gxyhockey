# GxyGo Transit — Mod Data Contract

The GxyGo website reads JSON files published by the GxyGo mod (same pattern as the
Seasonal Forecast weather mod). The mod commits these files into the Pages repo so
the site fetches them same-origin (no CORS). The site always fetches with a
cache-buster: `trains.json?_=<timestamp>`.

Publish these files to: `businesses/gxygo/`

---

## 1. trains.json  (live train feed — overwritten each update)

```json
{
  "updated": "2026-06-29T18:42:07.512Z",   // ISO 8601 UTC, real-world publish time
  "trains": [
    {
      "name": "Red Line Express",          // train display name
      "line": "red",                        // matches a line id in lines.json (optional)
      "speed": {
        "blocksPerTick": 1.2,               // raw Create speed
        "ms": 24.0,                         // meters/second (1 block = 1 m)
        "kmh": 86.4                         // km/h
      },
      "moving": true,                       // movement flags
      "backwards": false,
      "derailed": false,
      "carriages": 3,                       // carriage count
      "lengthBlocks": 18,                   // total train length in blocks
      "dimensions": ["minecraft:overworld"],// array — a train can span a portal
      "currentStation": null,               // station name, or null while in transit
      "nextStation": "MiniGame Land",       // next destination
      "distanceRemaining": 240,             // blocks remaining along the path
      "schedule": {
        "stops": ["Skyline Street","The City North","MiniGame Land","..."], // ordered
        "currentIndex": 1,                  // current position in the schedule
        "state": "cyclic"                   // cyclic | paused | completed
      }
    }
  ]
}
```

Notes:
- `trains` may be empty `[]` — the site shows "no trains reporting".
- Any field may be missing; the site degrades gracefully.
- `currentStation` null = in transit; the site then shows `nextStation` + `distanceRemaining`.

## 2. stations.json  (global sorted station list)

```json
{
  "updated": "2026-06-29T18:00:00Z",
  "stations": ["Basalt Station","City Cinema","..."]   // sorted A→Z
}
```

## 3. lines.json  (the transit lines — colors + ordered stations)

```json
{
  "updated": "2026-06-29T18:00:00Z",
  "system": "GxyGo Transit",
  "lines": [
    { "id": "red",  "name": "Red Line",  "color": "#d4202a", "stations": ["...","..."] },
    { "id": "blue", "name": "Blue Line", "color": "#1d4ed8", "stations": ["...","..."] }
  ]
}
```

`id` ties a train (`trains[].line`) to its line color on the site. You can maintain
lines.json by hand, or have the mod publish it — either works.

---

## How the site uses each file
- **Live Board (index.html):** trains.json (live cards) + lines.json (colors + line list)
- **Schedules (schedules.html):** lines.json (stop order) + trains.json (live positions)
- **Fares/Ride (ride.html):** lines.json (line pills)

Update cadence is up to the mod — publish on a timer or on train events. The
`updated` stamp is treated as "last updated", never an error.

# Weather Dashboard

This is a simple weather dashboard that fetches geocoding from Nominatim (OpenStreetMap) and weather data from Open-Meteo (no API key required).

Features:
- Search by city/place name (uses Nominatim for lat/lon)
- Shows current temperature, wind and time
- Shows daily forecast (max/min temps and precipitation)

How to run
1. Clone the repository or download the files.
2. Serve the folder with a local HTTP server (recommended) to avoid some browser restrictions when opening files directly:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

3. Open `index.html` in your browser and search for a city (e.g. "Madrid").

Notes
- This demo uses public APIs that do not require authentication. Be mindful of usage limits and fair use policies.
- You can extend the dashboard to include hourly data, icons for weather codes, caching, and nicer UI/UX.

License: MIT

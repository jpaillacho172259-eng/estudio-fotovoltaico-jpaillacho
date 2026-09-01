// app.js - simple weather dashboard using Nominatim + Open-Meteo

const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const result = document.getElementById('result');
const locationEl = document.getElementById('location');
const currentEl = document.getElementById('current');
const dailyEl = document.getElementById('daily');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const place = cityInput.value.trim();
  if (!place) return;
  clearUI();
  showLoading(true);

  try {
    const geo = await geocode(place);
    if (!geo) throw new Error('Location not found');
    locationEl.textContent = `${geo.display_name}`;

    const weather = await fetchWeather(geo.lat, geo.lon);
    renderWeather(weather);
    result.classList.remove('hidden');
  } catch (err) {
    showError(err.message || 'Error fetching data');
    console.error(err);
  } finally {
    showLoading(false);
  }
});

function clearUI(){
  errorEl.classList.add('hidden');
  result.classList.add('hidden');
  dailyEl.innerHTML = '';
  currentEl.innerHTML = '';
  locationEl.textContent = '';
}

function showLoading(yes){
  loadingEl.classList.toggle('hidden', !yes);
}

function showError(msg){
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}

async function geocode(q){
  // Use Nominatim OpenStreetMap for geocoding
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  return data[0] || null;
}

async function fetchWeather(lat, lon){
  // Open-Meteo: current_weather + daily forecast
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather API failed');
  return await res.json();
}

function renderWeather(data){
  // Current
  const cw = data.current_weather;
  currentEl.innerHTML = `
    <div class="big">${cw.temperature}°C</div>
    <div class="meta">
      <div>Wind: ${cw.windspeed} km/h</div>
      <div>Direction: ${cw.winddirection}°</div>
      <div>Weather code: ${cw.weathercode}</div>
      <div>Time: ${cw.time}</div>
    </div>
  `;

  // Daily
  if (data.daily){
    const days = data.daily.time.map((t, i) => ({
      date: t,
      tmin: data.daily.temperature_2m_min[i],
      tmax: data.daily.temperature_2m_max[i],
      precip: data.daily.precipitation_sum[i],
      code: data.daily.weathercode[i]
    }));

    dailyEl.innerHTML = '';
    days.forEach(d => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="label">${d.date}</div>
        <div class="value">${d.tmax}° / ${d.tmin}°</div>
        <div class="meta">Precip: ${d.precip} mm • code: ${d.code}</div>
      `;
      dailyEl.appendChild(card);
    });
  }
}

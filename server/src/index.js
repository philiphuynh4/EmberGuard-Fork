// server/src/index.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client1')));

const housingRoutes = require('./routes/housing');
app.use('/api/housing', housingRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const CountySchema = new mongoose.Schema({
  countyName: String,
  fips: String,
  geometry: Object,
  centroid: { lat: Number, lng: Number },
  riskScore: Number,
  riskLevel: String,
  resources: Object
});
const County = mongoose.model('County', CountySchema);

const geojsonPath = path.join(__dirname, '../data/WA_County_Boundaries.geojson');
const counties = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

function getSamplePoints(county) {
  const { lat, lng } = county.centroid;
  const delta = 0.1;
  return [
    { lat, lng },
    { lat: lat + delta, lng: lng + delta },
    { lat: lat - delta, lng: lng - delta },
    { lat: lat + delta, lng: lng - delta },
    { lat: lat - delta, lng: lng + delta },
  ];
}

async function fetchCountyFWIAverage(county) {
  const apiKey = process.env.OWM_FIRE_KEY;
  if (!apiKey) throw new Error('Missing OpenWeather Fire API key');

  const coords = getSamplePoints(county);
  const fwiValues = [];

  for (const { lat, lng } of coords) {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/fwi?lat=${lat}&lon=${lng}&appid=${apiKey}`);
      const json = await res.json();
      const fwi = json.list?.[0]?.main?.fwi;
      if (fwi !== undefined && fwi !== null) {
        fwiValues.push(fwi);
      }
    } catch (err) {
      console.warn(`❌ FWI fetch failed at ${lat},${lng}`);
    }
  }

  if (!fwiValues.length) return null;
  return fwiValues.reduce((a, b) => a + b, 0) / fwiValues.length;
}

async function getNWSWeather(lat, lng) {
  try {
    const pointsRes = await fetch(`https://api.weather.gov/points/${lat},${lng}`);
    const pointsData = await pointsRes.json();

    if (!pointsData.properties?.observationStations) throw new Error('Invalid NWS points response');

    const stationsRes = await fetch(pointsData.properties.observationStations);
    const stations = (await stationsRes.json()).observationStations;

    if (!Array.isArray(stations) || stations.length === 0) throw new Error('No stations found');

    const weatherData = [];
    for (let i = 0; i < Math.min(stations.length, 5); i++) {
      try {
        const obsRes = await fetch(`${stations[i]}/observations/latest`);
        const obs = (await obsRes.json()).properties;

        if (obs?.temperature?.value !== null) {
          weatherData.push({
            temp: obs.temperature.value * 9 / 5 + 32,
            humidity: obs.relativeHumidity.value,
            dewPoint: obs.dewpoint?.value ? obs.dewpoint.value * 9 / 5 + 32 : null,
            windSpeed: obs.windSpeed.value ? obs.windSpeed.value * 0.621371 : 0,
            windGust: obs.windGust?.value ? obs.windGust.value * 0.621371 : 0,
            windDir: obs.windDirection.value,
            precip: obs.precipitationLast24Hours?.value || 0,
            time: obs.timestamp
          });
        }
      } catch (_) { continue; }
    }

    if (!weatherData.length) return null;
    const avg = (arr, key) => arr.reduce((sum, x) => sum + (x[key] || 0), 0) / arr.length;

    return {
      temp: avg(weatherData, 'temp'),
      humidity: avg(weatherData, 'humidity'),
      dewPoint: avg(weatherData, 'dewPoint'),
      windSpeed: avg(weatherData, 'windSpeed'),
      windGust: avg(weatherData, 'windGust'),
      windDir: avg(weatherData, 'windDir'),
      precip: avg(weatherData, 'precip'),
      daysSinceRain: weatherData.some(d => d.precip > 0)
        ? 0 : (new Date() - new Date(weatherData[0].time)) / (1000 * 60 * 60 * 24)
    };
  } catch (err) {
    console.error('⚠️ getNWSWeather error:', err.message);
    return null;
  }
}

function computeRiskFromWeather(w, opts = {}) {
  const humidity = w.humidity ?? 50;
  const daysSinceRain = w.daysSinceRain ?? 3;
  const windSpeed = w.windSpeed ?? 5;
  const windGust = w.windGust ?? 0;
  const temp = w.temp ?? 70;
  const dewPoint = w.dewPoint ?? 45;

  const dryness = Math.min((100 - humidity), 100);
  const vaporDeficit = Math.max(temp - dewPoint, 0);
  const windFactor = Math.min(windSpeed * 1.5 + windGust * 0.5, 100);
  const drought = Math.min(daysSinceRain * 5, 100);

  const fwi = opts.fwi ?? 0;
  const fuelDryness = opts.fuelDryness ?? 0;
  const stability = opts.hainesIndex ?? 0;
  const topographyScore = opts.topographyScore ?? 10;
  const wuiExposure = opts.wuiExposure ?? 10;
  const fireHistoryScore = opts.fireHistoryScore ?? 5;

  let raw = (
    dryness * 0.15 +
    vaporDeficit * 0.10 +
    windFactor * 0.10 +
    drought * 0.05 +
    fwi * 0.30 +
    fuelDryness * 0.10 +
    stability * 0.05 +
    topographyScore * 0.05 +
    wuiExposure * 0.05 +
    (10 - fireHistoryScore) * 0.05
  );

  const score = Math.min(Math.round(raw * 10) / 10, 100);
  let level = 'minimal';
  if (score >= 70) level = 'extreme';
  else if (score >= 50) level = 'high';
  else if (score >= 30) level = 'moderate';
  else if (score >= 15) level = 'low';

  return { score, level: level.toLowerCase() };
}

async function seedCounties() {
  await County.deleteMany({});
  const docs = counties.features.map(f => {
    const [lng, lat] = f.geometry.coordinates[0][0];
    return {
      countyName: f.properties.JURISDICT_NM,
      fips: f.properties.JURISDICT_FIPS_DESG_CD,
      geometry: f.geometry,
      centroid: { lat, lng },
      riskScore: 0,
      riskLevel: 'minimal',
      resources: {}
    };
  });
  await County.insertMany(docs);
  console.log('🌱 counties seeded');

  const all = await County.find();
  for (const c of all) {
    const weather = await getNWSWeather(c.centroid.lat, c.centroid.lng);
    const fwi = await fetchCountyFWIAverage(c);
    if (!weather) continue;
    const { score, level } = computeRiskFromWeather(weather, { fwi });
    c.riskScore = score;
    c.riskLevel = level;
    await c.save();
  }
  console.log('✅ FWI-enhanced risk computed for all counties');
}

cron.schedule('0 7 * * *', async () => {
  console.log('🔄 running daily risk refresh');
});

app.get('/api/counties', async (req, res) => {
  const counties = await County.find();
  const geojson = {
    type: 'FeatureCollection',
    features: counties.map(c => ({
      type: 'Feature',
      geometry: c.geometry,
      properties: {
        countyName: c.countyName,
        fips: c.fips,
        riskLevel: c.riskLevel
      }
    }))
  };
  res.json(geojson);
});

async function fetchAQI(lat, lng) {
  const apiKey = process.env.OWM_FIRE_KEY;
  const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const index = data.list?.[0]?.main?.aqi;

    const labelMap = {
      1: "Good",
      2: "Fair",
      3: "Moderate",
      4: "Poor",
      5: "Very Poor"
    };

    return {
      index,
      label: labelMap[index] || "Unknown"
    };
  } catch (err) {
    console.warn(`⚠️ Failed to fetch AQI:`, err.message);
    return { index: null, label: "Unavailable" };
  }
}

app.get('/api/counties/:fips', async (req, res) => {
  try {
    const fips = req.params.fips;
    const county = await County.findOne({ fips });
    if (!county) return res.status(404).json({ error: 'County not found' });

    const weather = await getNWSWeather(county.centroid.lat, county.centroid.lng);
    const fwi = await fetchCountyFWIAverage(county);
    if (!weather) return res.status(500).json({ error: 'No valid weather data' });

    const { score, level } = computeRiskFromWeather(weather, { fwi });
    const aqi = await fetchAQI(county.centroid.lat, county.centroid.lng);

    res.json({
      countyName: county.countyName,
      fips,
      riskScore: score,
      riskLevel: level,
      weather,
      fwi,
      aqi,
      recentFires: []
    });
  } catch (err) {
    console.error('🔥 /api/counties/:fips error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

console.log('⏳ connecting to MongoDB...');
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedCounties();
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  });

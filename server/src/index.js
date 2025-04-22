// main server: loads env vars, parses geojson, seeds mongodb, 
// sets up api endpoints and daily risk updates
require('dotenv').config()
console.log('⚙️  index.js loaded')
console.log('MONGO_URI:', process.env.MONGO_URI ? '✔️ loaded' : '❌ not set')
console.log(
  'OPENWEATHER_KEY:',
  process.env.OPENWEATHER_KEY ? '✔️ loaded' : '❌ not set'
)

const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const cron = require('node-cron')

// read & parse the GeoJSON
const geojsonPath = path.join(
  __dirname,
  '..',
  'data',
  'WA_County_Boundaries.geojson'
)
const counties = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'))

// mongoose setup
const CountySchema = new mongoose.Schema({
  countyName: String,
  fips: String,
  geometry: Object,
  centroid: { lat: Number, lng: Number },
  riskScore: Number,
  riskLevel: String,
  resources: Object,
})
const County = mongoose.model('County', CountySchema)

const cors = require('cors')            
const app = express()
app.use(express.json())

app.use(cors())
app.use(express.json())

/**
 * computeRisk — fetches weather and returns a normalized risk index
 * using only temp, humidity, and wind from OpenWeather.
 * @param {Object} county — must have county.centroid.{lat,lng}
 * @returns {Promise<{score: number, level: string}>}
 */
async function computeRisk(county) {
  // 1) grab the raw weather
  const { lat, lng } = county.centroid;
  const apiKey = process.env.OPENWEATHER_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${apiKey}`
  );
  const data = await res.json();
  const temp = data.main.temp;       // °F
  const humidity = data.main.humidity; // 0–100%
  const wind = data.wind.speed;       // mph

  // 2) normalize each to 0–1
  //    temp 32–100°F → [0,1]; anything outside clamps
  const tNorm = Math.min(Math.max((temp - 32) / (100 - 32), 0), 1);
  //    dryness = inverse humidity
  const dNorm = (100 - humidity) / 100;
  //    wind 0–30 mph → [0,1]
  const wNorm = Math.min(wind / 30, 1);

  // 3) weighted sum (weights sum to 1)
  const wT = 0.4, wD = 0.35, wW = 0.25;
  const raw = tNorm * wT + dNorm * wD + wNorm * wW;

  // 4) scale to 0–100 and round to two decimals
  const score = Math.round(raw * 10000) / 100; // e.g. 42.37

  // 5) bucket into risk levels
  let level;
  if (score <= 33) level = 'green';
  else if (score <= 66) level = 'yellow';
  else level = 'red';

  return { score, level };
}

// seed DB once (drops old data to ensure correct fields)
async function seedCounties() {
  await County.deleteMany({})
  const docs = counties.features.map(f => {
    // hacky centroid pick; replace with proper calc if you want
    const [lng, lat] = f.geometry.coordinates[0][0]
    return {
      countyName: f.properties.JURISDICT_NM,
      fips: f.properties.JURISDICT_FIPS_DESG_CD,
      geometry: f.geometry,
      centroid: { lat, lng },
      riskScore: 0,
      riskLevel: 'green',
      resources: {},
    }
  })
  await County.insertMany(docs)
  console.log('🗄️  seeded counties with defaults')

  const all = await County.find()
  for (const c of all) {
    const { score, level } = await computeRisk(c)    // computeRisk uses raw.toFixed(2)
    c.riskScore = score
    c.riskLevel = level
    await c.save()
  }
  console.log('🔢 computed & saved fresh riskScores')
}

// cron job to refresh risk at 7am daily
cron.schedule('0 7 * * *', async () => {
  console.log('🔄 running daily risk update')
  const all = await County.find()
  for (const c of all) {
    const { score, level } = await computeRisk(c)
    c.riskScore = score
    c.riskLevel = level
    await c.save()
  }
  console.log('updated risk levels')
})

// endpoints
app.get('/', (req, res) => {
  res.send('FireSource backend is running. Try /api/counties');
});
app.get('/api/counties', async (req, res) => {
  const list = await County.find({}, 'countyName fips riskLevel geometry')
  res.json(list)
})

app.get('/api/counties/:fips', async (req, res) => {
  // 1. grab the county doc
  const c = await County.findOne({ fips: req.params.fips });
  if (!c) return res.status(404).send('not found');

  // 2. fetch current weather from OpenWeather
  const { lat, lng } = c.centroid;
  const apiKey = process.env.OPENWEATHER_KEY;
  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${apiKey}`
  );
  const weather = await weatherRes.json();

  // 3. send back a combined payload
  res.json({
    countyName: c.countyName,
    fips: c.fips,
    riskScore: c.riskScore,
    riskLevel: c.riskLevel,
    weather: {
      temp: weather.main.temp,
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed,
      description: weather.weather[0]?.description || ''
    },
    resources: c.resources
  });
});

const PORT = process.env.PORT || 3000

console.log('⏳ attempting to connect to mongo…')
mongoose
  .connect(process.env.MONGO_URI, {/*…*/})
  .then(async () => {
    console.log('✅ db connected')
    await seedCounties()
    app.listen(PORT, () =>
      console.log(`🚀 server listening on http://localhost:${PORT}`)
    )
  })
  .catch(err => {
    console.error('❌ db connection error:', err)
    process.exit(1)
  })
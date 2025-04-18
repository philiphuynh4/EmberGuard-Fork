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

const app = express()
app.use(express.json())

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
  console.log('seeded counties')
}

// simple weather‑based risk calc
async function computeRisk(county) {
  const { lat, lng } = county.centroid
  const apiKey = process.env.OPENWEATHER_KEY
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${apiKey}`
  )
  const data = await res.json()
  const temp = data.main.temp
  const humidity = data.main.humidity
  const wind = data.wind.speed
  const score = temp * 0.4 + (100 - humidity) * 0.3 + wind * 0.3
  const level = score > 60 ? 'red' : score > 40 ? 'yellow' : 'green'
  return { score: Math.round(score), level }
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
  const c = await County.findOne({ fips: req.params.fips })
  if (!c) return res.status(404).send('not found')
  res.json(c)
})

const PORT = process.env.PORT || 3000

console.log('⏳ attempting to connect to mongo…')
mongoose
  .connect(process.env.MONGO_URI, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  })
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

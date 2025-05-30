const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const nwsUrl = 'https://api.weather.gov/alerts/active?area=WA';
    const response = await fetch(nwsUrl);
    const data = await response.json();

    const alerts = data.features.map(feature => ({
      id: feature.id,
      headline: feature.properties.headline,
      description: feature.properties.description,
      areaDesc: feature.properties.areaDesc,
      severity: feature.properties.severity,
      certainty: feature.properties.certainty,
      urgency: feature.properties.urgency,
      event: feature.properties.event,
      effective: feature.properties.effective,
      expires: feature.properties.expires,
      instruction: feature.properties.instruction,
      senderName: feature.properties.senderName,
    }));

    res.json({ alerts });
  } catch (err) {
    console.error('Error fetching NWS alerts:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

module.exports = router;

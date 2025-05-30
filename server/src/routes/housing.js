const express = require('express');
const router = express.Router();
const HousingRequest = require('../../models/HousingRequest');

router.post('/', async (req, res) => {
  try {
    const request = new HousingRequest(req.body);
    await request.save();
    res.status(201).json({ success: true, message: 'Request submitted successfully.' });
  } catch (err) {
    console.error('Error saving housing request:', err);
    res.status(500).json({ success: false, error: 'Failed to save request' });
  }
});

module.exports = router;

router.get('/', async (req, res) => {
  try {
    const requests = await HousingRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('❌ Error fetching housing requests:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});
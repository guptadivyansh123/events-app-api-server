/**
 * returns data for '/events' routes
 */
const express = require('express');
const router = express.Router();
const db = require('../services/database.service');

/**
 * GET /events
 * Returns an array of all the events
 */
router.get('/', async (req, res) => {
    res.json(await db.getEvents());
});

/**
 * GET /events/search/title/:title
 * Returns array of events with titles that include the :title parameter value
 */
router.get('/search/title/:title', async (req, res) => {
    res.json(await db.getEventsByTitle(req.params.title));
});

module.exports = router;

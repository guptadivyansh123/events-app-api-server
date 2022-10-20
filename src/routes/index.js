/**
 * Returns a message when the base route '/' is called
 */
const express = require('express');
const router = express.Router();
const AppConfig = require('../app.config');
const appConfig = new AppConfig();

/* GET base route. */
router.get('/', function(req, res, next) {
  res.json({message: `Events API Server. Version: ${appConfig.version}`});
});

router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;

/**
 * returns data for '/config' routes
 */
const express = require('express');
const router = express.Router();
const cg = require('../services/config.service');

/**
 * GET /config
 */
router.get('/', (req, res) => {
   res.json({ config: cg.getConfig()});
});

/**
 * GET /config/:key where :key is replaced by the config KVP key that you want to retrieve
 * For example: /config/version will return {version: 0.0.1} or whatever the version is.
 * If a key does not exist the value will be returned as null
 */
router.get('/:key', (req, res) => {
   res.json({config: cg.getConfigByKey(req.params.key)});
});

module.exports = router;

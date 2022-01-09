const express = require('express');
const router = express.Router();
const traffic = require('../controllers/traffic');

/* GET traffic data. */
router.get('/air', async function(req, res, next) {
  try {
    res.json(await traffic.airRead(req.query.dateFrom, req.query.dateTo))
  } catch (err) {
    console.log('Error while getting air traffic data', err.message);
    next(err)
  }
});

router.get('/air2', async function(req, res, next) {
  try {
    res.json(await traffic.airRead2(req.query.dateFrom, req.query.dateTo))
  } catch (err) {
    console.log('Error while getting air traffic data', err.message);
    next(err)
  }
});

router.get('/sea', async function(req, res, next) {
  try {
    res.json(await traffic.seaRead(req.query.dateFrom, req.query.dateTo))
  } catch (err) {
    console.log('Error while getting sea traffic data', err.message);
    next(err)
  }
});

router.get('/sea2', async function(req, res, next) {
  try {
    res.json(await traffic.seaRead2(req.query.dateFrom, req.query.dateTo))
  } catch (err) {
    console.log('Error while getting sea traffic data', err.message);
    next(err)
  }
});

router.get('/road', async function(req, res, next) {
  try {
    res.json(await traffic.roadRead(req.query.dateFrom, req.query.dateTo, req.query.stm, req.query.vehicleType, req.query.page))
  } catch (err) {
    console.log('Error while getting road traffic data', err.message);
    next(err)
  }
});

router.get('/stm', async function(req, res, next) {
  try {
    res.json(await traffic.stmRead())
  } catch (err) {
    console.log('Error while getting counting spots data', err.message);
    next(err)
  }
});

module.exports = router;
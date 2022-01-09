const express = require('express');
const router = express.Router();
const covid = require('../controllers/covid');

/* GET base data. */
router.get('/base', async function(req, res, next) {
  try {
    res.json(await covid.getCovidData(req.query.dateFrom, req.query.dateTo, req.query.region))
  } catch (err) {
    console.log('Error while getting covid data', err.message);
    next(err)
  }
});

/* GET base to date data. */
router.get('/baseToDate', async function(req, res, next) {
  try {
    res.json(await covid.getCovidToDateData(req.query.dateFrom, req.query.dateTo, req.query.region))
  } catch (err) {
    console.log('Error while getting date covid data', err.message);
    next(err)
  }
});

/* GET government response data. */
router.get('/govRes', async function(req, res, next) {
  try {
    res.json(await covid.getGovRes(req.query.dateFrom, req.query.dateTo))
  } catch (err) {
    console.log('Error while getting government response data', err.message);
    next(err)
  }
});

module.exports = router;
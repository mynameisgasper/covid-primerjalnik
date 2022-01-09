const express = require('express');
const router = express.Router();
const mobility = require('../controllers/mobility');

/* GET mobility data. */
router.get('/apple', async function(req, res, next) {
  try {
    res.json(await mobility.getAppleData(req.query.dateFrom, req.query.dateTo))
  } catch (err) {
    console.log('Error while getting apple mobility data', err.message);
    next(err)
  }
});

router.get('/google', async function(req, res, next) {
  try {
    res.json(await mobility.getGoogleData(req.query.dateFrom, req.query.dateTo, req.query.region, req.query.groupType))
  } catch (err) {
    console.log('Error while getting google mobility data', err.message);
    next(err)
  }
});

router.get('/region', async function(req, res, next) {
    try {
      res.json(await mobility.getRegionData())
    } catch (err) {
      console.log('Error while getting region data', err.message);
      next(err)
    }
  });

module.exports = router;
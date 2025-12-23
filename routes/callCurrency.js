const express = require('express');
const router = express.Router();

const { getCurrency_live,getCurrencies,getThickHistoricalRates,getHistoricalRates } = require('../controllers/currency.js');

router.route('/getCurrencies').get(getCurrencies);
router.route('/getCurrency_live').get(getCurrency_live);
router.route('/getThickHistoricalRates').get(getThickHistoricalRates);
router.route('/getHistoricalRates').get(getHistoricalRates);
module.exports = router;
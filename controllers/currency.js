
//https://marketdata.tradermade.com/api/v1/live_currencies_list?api_key=api_key

const { response } = require("express");

const url = 'https://marketdata.tradermade.com/api/v1/live_currencies_list?api_key=' + process.env.TRADERMADE_API_KEY


const getCurrencies = async  (req, res) => {
    let repsonse2 = await fetch(url)
        .then(response => {return response.json()})
        .catch(error => console.error('Error:', error))
    res.status(200).json(repsonse2.available_currencies);
}

//https://marketdata.tradermade.com/api/v1/live?currency=EURUSD,GBPUSD&api_key=api_key



const getCurrency_live = async (req, res) => {
    const { fromCurrency, toCurrency } = req.query;
    const urlLive = `https://marketdata.tradermade.com/api/v1/live?currency=${fromCurrency}${toCurrency}&api_key=${process.env.TRADERMADE_API_KEY}`
    let repsons2 = await fetch(urlLive)
        .then(response => {return response.json()})
        .catch(error => {
            console.error('Error:', error)
        })
    res.status(200).json(repsons2.json())
}

//https://marketdata.tradermade.com/api/v1/tick_historical/GBPUSD/2025-04-10-08:30/2025-04-10-09:00?api_key=api_key

const getThickHistoricalRates = async (req, res)=>{
    const { fromCurrency, toCurrency } = req.query
    const urlThickHistorical = `https://marketdata.tradermade.com/api/v1/tick_historical/${fromCurrency}${toCurrency}/2025-04-10-08:30/2025-04-10-09:00?api_key=${process.env.TRADERMADE_API_KEY}`
    let response2 = await fetch(urlThickHistorical)
    .then(response => {return response.json()})
    .catch(error => {
        console.error('Error:', error)
    })
    res.status(200).json(response2)
}

//https://marketdata.tradermade.com/api/v1/historical?currency=EURUSD&date=2019-10-09&api_key=api_key
// const getHistoricalRates = async (req, res)=>{
//     const { fromCurrency, toCurrency, date
//      } = req.query
//     const urlThickHistorical = `https://marketdata.tradermade.com/api/v1/historical?currency=${fromCurrency}${toCurrency}&date=${date}&api_key=${process.env.TRADERMADE_API_KEY}`
//     let response2 = await fetch(urlThickHistorical)
//     .then(response => {return response.json()})
//     .catch(error => {
//         console.error('Error:', error)
//     })
//     res.status(200).json(response2)
// }

const getHistoricalRates = (req, res) => {
  const { fromCurrency, toCurrency, date } = req.query;

  const urlThickHistorical = `https://marketdata.tradermade.com/api/v1/historical?currency=${fromCurrency}${toCurrency}&date=${date}&api_key=${process.env.TRADERMADE_API_KEY}`;

  fetch(urlThickHistorical)
    .then(response => {
        console.log(response);
      if (!response.ok) {
        throw new Error(response);
      }
      return response.json();
    })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({
        message: 'Error al obtener el histórico',
        error: error.message
      });
    });
};


module.exports = {
    getCurrencies,
    getCurrency_live,
    getThickHistoricalRates,
    getHistoricalRates
}
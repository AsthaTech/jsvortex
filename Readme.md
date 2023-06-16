# Vortex API NodeJS Client


Official javascript client for communicating with [Vortex API](https://asthatrade.com/vortex)

Vortex APIs are meant for clients who want to execute orders based on their own strategy programatically and for partners to build their own applications. These apis provide a fast and secure way to place trades, manage positions and access real time market data.

## Documentation 
- [JS Documentation](https://vortex.asthatrade.com/docs/jsvortex/index.html)
- [API Documentation](https://vortex.asthatrade.com/docs/)


## Installation 

Install via [npm](https://www.npmjs.com/package/@asthatrade/jsvortex)
```
npm i @asthatrade/jsvortex@latest
``` 

## Usage 

The api methods always return a promise which you can use to call methods like `.then(...)` and `.catch(...)`. Refer: [Promises](#https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


## Getting Started with APIs 

```js
var VortexAPI = require("@asthatrade/jsvortex").VortexAPI
var Constants = require("@asthatrade/jsvortex").Constants

var client = new VortexAPI("api_secret","application_id")


client.login("client_code","password","totp").then(async (res)=> {
    await run()
}).catch((err)=>{
    console.log(err)
})

async function run(){
    var order_book = await client.orders()
    console.log("order book", order_book)

    var positions = await client.positions()
    console.log("positions",positions)

    client.quotes(["NSE_EQ-22"],Constants.QuoteModes.LTP).then((res)=>{
        return client.placeOrder(Constants.ExchangeTypes.NSE_EQUITY,22,Constants.TransactionTypes.SELL,Constants.ProductTypes.INTRADAY,Constants.VarietyTypes.REGULAR_MARKET_ORDER,1,res.data["NSE_EQ-22"].last_trade_price,0,0,Constants.ValidityTypes.FULL_DAY)
    })
    .then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
}
```

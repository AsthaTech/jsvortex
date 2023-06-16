# Vortex API NodeJS Client


Official javascript client for communicating with [Vortex API](https://asthatrade.com/vortex)

Vortex APIs are meant for clients who want to execute orders based on their own strategy programatically and for partners to build their own applications. These apis provide a fast and secure way to place trades, manage positions and access real time market data.

## Documentation 
- [JS Documentation](https://vortex.asthatrade.com/docs/jsvortex/)
- [API Documentation](https://vortex.asthatrade.com/docs/)


## Installation 

Install via [npm](https://www.npmjs.com/package/@asthatrade/jsvortex)
```
npm i @asthatrade/jsvortex@latest
``` 

## Usage 

The api methods always return a promise which you can use to call methods like `.then(...)` and `.catch(...)`. Refer: [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


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

## Getting started with Feed 

```js 

var JSONbig = require('json-bigint');

var VortexFeed = require("@asthatrade/jsvortex").VortexFeed
var Constants = require("@asthatrade/jsvortex").Constants

const wire =  new VortexFeed("access_token",true,true)

wire.connect()
wire.on("price_update",onPriceUpdate)
wire.on("order_update", onOrderUpdate)
wire.on("error",onError)
wire.on("close",onClose)
wire.on("connect",onConnect)

function onConnect(){
    wire.subscribe(Constants.ExchangeTypes.NSE_EQUITY,26000,Constants.QuoteModes.OHLCV)
    wire.subscribe(Constants.ExchangeTypes.NSE_EQUITY,26009,Constants.QuoteModes.OHLCV)
}

function onPriceUpdate(updates){
    console.log(JSONbig.stringify(updates))
}

function onOrderUpdate(update){
    console.log(update)
}

function onClose(reason){
    console.log(reason)
}

function onError(reason){
    console.log(reason)
}


```

## Run Tests 

```
yarn test
```

## Generate Docs

```
yarn generate-docs
```
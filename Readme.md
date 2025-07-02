# Vortex API NodeJS Client


Official javascript client for communicating with [Vortex API](https://rupeezy.in/vortex)

Vortex APIs are meant for clients who want to execute orders based on their own strategy programatically and for partners to build their own applications. These apis provide a fast and secure way to place trades, manage positions and access real time market data.

## Documentation 
- [JS Documentation](https://vortex.rupeezy.in/docs/jsvortex/)
- [API Documentation](https://vortex.rupeezy.in/docs/)


## Installation 

Install via [npm](https://www.npmjs.com/package/@rupeezy/jsvortex)
```
npm i @rupeezy/jsvortex@latest
``` 

## Usage 

The api methods always return a promise which you can use to call methods like `.then(...)` and `.catch(...)`. Refer: [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


## Getting Started with APIs 

```js
var VortexAPI = require("@rupeezy/jsvortex").VortexAPI
var Constants = require("@rupeezy/jsvortex").Constants

var client = new VortexAPI("api_secret","application_id")

// Get an auth code from sso login. SSO Login URL can be gotten by 

var login_url = client.sso_login_url("any param of your choice")

// Exchange auth code for access token
var auth_code = "auth code received after login"
client.exchange_token(auth_code).then(async (res)=> {
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
        return client.place_order(Constants.ExchangeTypes.NSE_EQUITY,22,Constants.TransactionTypes.SELL,Constants.ProductTypes.INTRADAY,Constants.VarietyTypes.REGULAR_MARKET_ORDER,1,res.data["NSE_EQ-22"].last_trade_price,0,0,Constants.ValidityTypes.FULL_DAY)
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

var VortexFeed = require("@rupeezy/jsvortex").VortexFeed
var Constants = require("@rupeezy/jsvortex").Constants

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

var JSONbig = require('json-bigint');

var VortexFeed = require("@asthatrade/jsvortex").VortexFeed
var Constants = require("@asthatrade/jsvortex").Constants

const wire =  new VortexFeed("access_token",true,true)

wire.connect()
wire.on("price_update",onPriceUpdate)
wire.on("order_update", printer)
wire.on("error",printer)
wire.on("close",printer)
wire.on("connect",()=>{
    wire.subscribe(Constants.ExchangeTypes.NSE_EQUITY,26000,Constants.QuoteModes.OHLCV)
    wire.subscribe(Constants.ExchangeTypes.NSE_EQUITY,26009,Constants.QuoteModes.OHLCV)
})
console.log(wire.connected())

function onPriceUpdate(updates){
    console.log(JSONbig.stringify(updates))
}

function printer(e){
    console.log(e)
}

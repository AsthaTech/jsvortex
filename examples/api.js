var VortexAPI = require("@asthatrade/jsvortex").VortexAPI
var Constants = require("@asthatrade/jsvortex").Constants

var client = new VortexAPI("api_secret","application_id")


client.login("client_code","password","totp").then(async (res)=> {
    console.log(res.data.access_token)
    // await run()
}).catch((err)=>{
    console.log(err)
})

async function run(){
    var order_book = await client.orders()
    console.log(order_book)

    var positions = await client.positions()
    console.log(positions)

    client.quotes(["NSE_EQ-22"],Constants.QuoteModes.LTP).then((res)=>{
        console.log(res)
        return client.place_order(Constants.ExchangeTypes.NSE_EQUITY,22,Constants.TransactionTypes.SELL,Constants.ProductTypes.INTRADAY,Constants.VarietyTypes.REGULAR_MARKET_ORDER,1,res.data["NSE_EQ-22"].last_trade_price,0,0,Constants.ValidityTypes.FULL_DAY)
    })
    .then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })

}
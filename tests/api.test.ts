import {VortexAPI} from "../src/index"
import * as Constants from  "../src/types";
import * as fs from 'fs';
import * as path from 'path';
const nock = require("nock");


const mockDir = "./vortex-mocks"
function parseJson(fileName: any){
    // read and parse mock json file
    var rawdata = fs.readFileSync(path.join(__dirname, mockDir, fileName));
    var mockData= JSON.parse(rawdata.toString());
    return mockData;
}

runtests()

function runtests() {
    var api =  new VortexAPI("api_secret","application_id")
    nock(api.base_url)
        .get("/user/funds")
        .reply(200, parseJson("funds.json"))

        .get("/portfolio/positions")
        .reply(200, parseJson("positions.json"))

        .get("/portfolio/holdings")
        .reply(200, parseJson("holdings.json"))

        .get("/trades?limit=20&offset=1")
        .reply(200, parseJson("trades.json"))

        .get("/orders?limit=20&offset=1")
        .reply(200, parseJson("orders.json"))

        .post("/orders/regular")
        .reply(200,parseJson("order.json"))

        .post("/margins/order")
        .reply(200,parseJson("margin.json"))

        .delete("/orders/regular/NSE_EQ/NXAAAE43234234")
        .reply(200,parseJson("order.json"))

        .put("/portfolio/positions")
        .reply(200,parseJson("position_conversion.json"))
        

    describe('funds', ()=>{
        it("is success", async ()=>{
            // expect.assertions(2)
            const res = await api.funds()
            console.log(res)
            expect(res.nse).toBeDefined
            expect(res.mcx).toBeDefined
        })
    })
    describe('holdings', ()=>{
        it("is success", async ()=>{
            // expect.assertions(2)
            const res = await api.holdings()
            console.log(res)
            expect(res.data).toBeDefined
        })
    })
    describe('positions', ()=>{
        it("is success", async ()=>{
            // expect.assertions(2)
            const res = await api.positions()
            console.log(res)
            expect(res.data).toBeDefined
        })
    })

    describe('trades', ()=>{
        it("is success", async ()=>{
            // expect.assertions(2)
            const res = await api.trades(20,1)
            console.log(res)
            expect(res.trades).toBeDefined
        })
    })

    describe('order book', ()=>{
        it("is success", async ()=>{
            // expect.assertions(2)
            const res = await api.orders(20,1)
            console.log(res)
            expect(res.orders).toBeDefined
        })
    })

    describe('order placement', ()=>{
        it("is success", async ()=>{
            // expect.assertions(2)
            const res = await api.placeOrder(Constants.ExchangeTypes.NSE_EQUITY,22,Constants.TransactionTypes.BUY,Constants.ProductTypes.DELIVERY,Constants.VarietyTypes.REGULAR_MARKET_ORDER,1,1800,0,0,Constants.ValidityTypes.FULL_DAY)
            console.log(res)
            expect(res.data).toBeDefined
            expect(res.data.orderId).toBeDefined
        })
    })
    describe('order cancellation', ()=>{
        it("is success", async ()=>{
            // expect.assertions(2)
            const res = await api.cancel_order(Constants.ExchangeTypes.NSE_EQUITY,"NXAAAE43234234")
            console.log(res)
            expect(res.data).toBeDefined
            expect(res.data.orderId).toBeDefined
        })
    })

    describe('order margin required', ()=>{
        it("is success", async ()=>{
            // expect.assertions(2)
            const res = await api.get_order_margin(Constants.ExchangeTypes.NSE_EQUITY,22,Constants.TransactionTypes.BUY,Constants.ProductTypes.DELIVERY,Constants.VarietyTypes.REGULAR_MARKET_ORDER,1,1800,Constants.OrderMarginModes.NEW_ORDER)
            console.log(res)
            expect(res.available).toBeDefined
            expect(res.required).toBeDefined
        })
    })

    describe('position conversion',()=>{
        it("is success", async ()=>{
            // expect.assertions(2)
            const res = await api.convert_position(Constants.ExchangeTypes.NSE_EQUITY,22,Constants.TransactionTypes.BUY,2,Constants.ProductTypes.INTRADAY,Constants.ProductTypes.DELIVERY)
            console.log(res)
            expect(res.code).toBeDefined
            expect(res.message).toBeDefined
            expect(res.status).toBeDefined
        })
    })
}

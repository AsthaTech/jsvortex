import exp from "constants";
import { VortexAPI } from "../src/index"
import * as Constants from "../src/types";
import * as fs from 'fs';
import * as path from 'path';
const nock = require("nock");


const mockDir = "./vortex-mocks"
function parseJson(fileName: any) {
    // read and parse mock json file
    var rawdata = fs.readFileSync(path.join(__dirname, mockDir, fileName));
    var mockData = JSON.parse(rawdata.toString());
    return mockData;
}

runtests()

function runtests() {
    var api = new VortexAPI("api_secret", "application_id", undefined, true)
    const from = new Date()
    const to = new Date()
    const from_time = Math.floor(from.getTime() / 1000)
    const to_time = Math.floor(to.getTime() / 1000)
    nock(api.base_url)

        .post(Constants.URILogin) //success
        .reply(200, parseJson("user/login.json"))

        .post(Constants.URILogin) //fail
        .reply(200, { status: "error", message: "Invalid credentials" })

        .post(Constants.URILogin) //fail
        .reply(500, { status: "error", message: "internal server error" })

        .get(Constants.URIFunds)
        .reply(200, parseJson("user/funds.json"))

        .get(Constants.URIFunds)
        .reply(500, { status: "error", message: "internal server error" })

        .get(Constants.URIPositions)
        .reply(200, parseJson("portfolio/positions.json"))

        .get(Constants.URIHoldings)
        .reply(200, parseJson("portfolio/holdings.json"))

        .get(Constants.URITrades)
        .reply(200, parseJson("portfolio/trades.json"))

        .get(Constants.URIOrderBook)
        .reply(200, parseJson("portfolio/orders.json"))

        .get(Constants.URIGttOrderBook)
        .reply(200, parseJson("gtt_orders/list.json"))

        .get(constructUrl(Constants.URIOrderHistory, "test"))
        .reply(200, parseJson("regular_orders/order_history.json"))

        .post(constructUrl(Constants.URIPlaceOrder, "regular")) //for full day validity
        .reply(200, parseJson("regular_orders/order.json"))

        .post(constructUrl(Constants.URIPlaceOrder, "regular")) //for IOC validity
        .reply(200, parseJson("regular_orders/order.json"))

        .post(constructUrl(Constants.URIPlaceOrder, "regular")) //for AMO validity
        .reply(200, parseJson("regular_orders/order.json"))

        .post(constructUrl(Constants.URIPlaceOrder, "gtt"))
        .reply(200, parseJson("gtt_orders/create.json"))

        .post(constructUrl(Constants.URIPlaceOrder, "iceberg"))
        .reply(200, parseJson("iceberg_orders/create.json"))

        .post(Constants.URIOrderMargin)
        .reply(200, parseJson("margins/order_margin.json"))

        .post(Constants.URIBasketMargin)
        .reply(200, parseJson("margins/basket_margin.json"))

        .delete(constructUrl(Constants.URIModifyOrder, "regular", "NXAAAE43234234"))
        .reply(200, parseJson("regular_orders/order.json"))

        .delete(constructUrl(Constants.URIModifyOrder, "gtt", "5a9da19d-400f-47ff-aabd-429a1c98ef26"))
        .reply(200, parseJson("regular_orders/order.json"))

        .put(Constants.URIConvertposition)
        .reply(200, parseJson("portfolio/position_conversion.json"))

        .put(constructUrl(Constants.URIModifyOrder, "regular", "test"))
        .reply(200, parseJson("regular_orders/order.json"))

        .put(constructUrl(Constants.URIModifyOrder, "iceberg", "test"))
        .reply(200, parseJson("iceberg_orders/modify.json"))

        .put(constructUrl(Constants.URIModifyOrder, "gtt", "test"))
        .reply(200, parseJson("gtt_orders/modify.json"))

        .put(constructUrl(Constants.URIModifyOrderTags,"regular","test"))
        .reply(200, parseJson("reports/tags/order_tags/update_order_tags.json"))

        .put(constructUrl(Constants.URIModifyOrderTags,"gtt","test"))
        .reply(200, parseJson("reports/tags/order_tags/update_order_tags.json"))

        .get(Constants.URIQuotes + "?q=NSE_EQ-22&mode=full")
        .reply(200, parseJson("data/quotes.json"))

        .get(Constants.URIHistory + "?exchange=NSE_EQ&token=22&to=" + to_time.toString() + "&from=" + from_time.toString() + "&resolution=1D")
        .reply(200, parseJson("data/history.json"))

        .post(Constants.URIMultiCancelrders)
        .reply(200, parseJson("regular_orders/multi_cancel.json"))

        .delete(constructUrl(Constants.URIModifyOrder, "iceberg", "test"))
        .reply(200, parseJson("iceberg_orders/delete.json"))

    describe('login', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.login("test", "test", "test")
            expect(res.data).toBeDefined
            expect(res.data.access_token).toBeDefined
        })

        it("is failure", async () => {
            // expect.assertions(2)
            const res = await api.login("test", "test", "test")
            expect(res.data).toBeUndefined
        })

        it("is internal server error", async () => {
            // expect.assertions(2)
            try {
                await api.login("test", "test", "test")
            } catch (error) {
                expect(error).toBeDefined
            }
        })

    })
    describe('funds', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.funds()
            expect(res.nse).toBeDefined
            expect(res.mcx).toBeDefined
        })

        it("is internal server error", async () => {
            // expect.assertions(2)
            try {
                await api.funds()
            } catch (error) {
                expect(error).toBeDefined
            }
        })
    })
    describe('holdings', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.holdings()
            expect(res.data).toBeDefined
        })
    })
    describe('positions', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.positions()
            expect(res.data).toBeDefined
        })
    })

    describe('trades', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.trades()
            expect(res.trades).toBeDefined
        })
    })

    describe('order book', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.orders()
            expect(res.orders[0].exchange).toEqual(Constants.ExchangeTypes.MCX)
        })
    })

    describe('order placement', () => {
        it("is success for full day", async () => {
            // expect.assertions(2)
            const request: Constants.PlaceOrderRequest = {
                exchange: Constants.ExchangeTypes.NSE_EQUITY,
                token: 22,
                transaction_type: Constants.TransactionTypes.BUY,
                product: Constants.ProductTypes.DELIVERY,
                quantity: 1,
                price: 1800,
                variety: Constants.VarietyTypes.REGULAR_MARKET_ORDER,
                disclosed_quantity: 0,
                trigger_price: 0,
                validity: Constants.ValidityTypes.FULL_DAY
            }
            const res = await api.place_order(request)
            expect(res.data).toBeDefined
            expect(res.data.order_id).toBeDefined
            expect(res.data.order_id).toEqual('NXAAE00002K3')
        })
        it("is success for IOC", async () => {
            // expect.assertions(2)
            const request: Constants.PlaceOrderRequest = {
                exchange: Constants.ExchangeTypes.NSE_EQUITY,
                token: 22,
                transaction_type: Constants.TransactionTypes.BUY,
                product: Constants.ProductTypes.DELIVERY,
                quantity: 1,
                price: 1800,
                variety: Constants.VarietyTypes.REGULAR_MARKET_ORDER,
                disclosed_quantity: 0,
                trigger_price: 0,
                validity: Constants.ValidityTypes.IMMEDIATE_OR_CANCEL
            }
            const res = await api.place_order(request)
            expect(res.data).toBeDefined
            expect(res.data.order_id).toBeDefined
            expect(res.data.order_id).toEqual('NXAAE00002K3')
        })
        it("is success for after market", async () => {
            // expect.assertions(2)
            const request: Constants.PlaceOrderRequest = {
                exchange: Constants.ExchangeTypes.NSE_EQUITY,
                token: 22,
                transaction_type: Constants.TransactionTypes.BUY,
                product: Constants.ProductTypes.DELIVERY,
                quantity: 1,
                price: 1800,
                variety: Constants.VarietyTypes.REGULAR_MARKET_ORDER,
                disclosed_quantity: 0,
                trigger_price: 0,
                validity: Constants.ValidityTypes.AFTER_MARKET
            }
            const res = await api.place_order(request)
            expect(res.data).toBeDefined
            expect(res.data.order_id).toBeDefined
            expect(res.data.order_id).toEqual('NXAAE00002K3')
        })
    })
    describe('order cancellation', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.cancel_order("NXAAAE43234234")
            expect(res.data).toBeDefined
            expect(res.data.order_id).toBeDefined
        })
    })

    describe('iceberg order placement', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const request: Constants.PlaceIcebergOrderRequest = {
                exchange: Constants.ExchangeTypes.NSE_EQUITY,
                token: 22,
                transaction_type: Constants.TransactionTypes.BUY,
                product: Constants.ProductTypes.DELIVERY,
                quantity: 1,
                price: 1800,
                trigger_price: 0,
                variety: Constants.VarietyTypes.REGULAR_LIMIT_ORDER,
                validity: Constants.ValidityTypes.FULL_DAY,
                legs: 2,
            }
            const res = await api.place_iceberg_order(request)
            expect(res.data).toBeDefined
            expect(res.data?.first_order_id).toBeDefined
            expect(res.data?.iceberg_order_id).toBeDefined
        })

    })

    describe('order margin required', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const request: Constants.OrderMarginRequest = {
                exchange: Constants.ExchangeTypes.NSE_EQUITY,
                token: 22,
                transaction_type: Constants.TransactionTypes.BUY,
                product: Constants.ProductTypes.DELIVERY,
                quantity: 1,
                price: 1800,
                variety: Constants.VarietyTypes.REGULAR_MARKET_ORDER,
                old_price: 0,
                old_quantity: 0,
                mode: Constants.OrderMarginModes.NEW_ORDER
            }
            const res = await api.get_order_margin(request)
            expect(res.available_margin).toBeDefined
            expect(res.required_margin).toBeDefined
        })
    })

    describe('basket margin required', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const request: Constants.BasketMarginRequest = {
                orders: [
                    {
                        exchange: Constants.ExchangeTypes.NSE_EQUITY,
                        token: 22,
                        transaction_type: Constants.TransactionTypes.BUY,
                        product: Constants.ProductTypes.DELIVERY,
                        quantity: 1,
                        price: 1800,
                        variety: Constants.VarietyTypes.REGULAR_MARKET_ORDER,
                    }
                ]
            }
            const res = await api.get_basket_margin(request)
            expect(res.initial_margin).toBeDefined
            expect(res.required_margin).toBeDefined
        })
    })

    describe('position conversion', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const request: Constants.ConvertPositionRequest = {
                exchange: Constants.ExchangeTypes.NSE_EQUITY,
                token: 22,
                transaction_type: Constants.TransactionTypes.BUY,
                quantity: 2,
                old_product: Constants.ProductTypes.INTRADAY,
                new_product: Constants.ProductTypes.DELIVERY
            }
            const res = await api.convert_position(request)
            expect(res.code).toBeDefined
            expect(res.message).toBeDefined
            expect(res.status).toBeDefined
        })
    })

    describe('order history', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.order_history("test")
            expect(res.orders).toBeDefined
            expect(res.orders[0]).toBeDefined
        })
    })

    describe('create gtt order', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const request: Constants.PlaceGttOrderRequest = {
                exchange: Constants.ExchangeTypes.NSE_EQUITY,
                token: 22,
                transaction_type: Constants.TransactionTypes.BUY,
                trigger_price: 1800,
                quantity: 1,
                price: 1800,
                product: Constants.ProductTypes.DELIVERY,
                gtt_trigger_type: 'single',
            }
            const res = await api.place_gtt_order(request)
            expect(res.data).toBeDefined
            expect(res.data.order_id).toBeDefined
            expect(res.data.order_id).toEqual('99823d7b-fd37-4d75-af7f-f21ec4671852')
        })
    })

    describe('gtt orders', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.gtt_orders()
            expect(res.data).toBeDefined
            expect(res.data[0]).toBeDefined
            expect(res.data[0].id).toEqual('5a9da19d-400f-47ff-aabd-429a1c98ef26')
        })
    })

    describe('cancel gtt order', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.cancel_gtt_order("5a9da19d-400f-47ff-aabd-429a1c98ef26")
            expect(res.status).toBeDefined
            expect(res.status).toEqual('success')
        })
    })

    describe('quotes should be available', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.quotes(["NSE_EQ-22"], Constants.QuoteModes.FULL)
            expect(res.status).toBeDefined
            expect(res.status).toEqual('success')
            expect(res.data).toBeDefined
            const keys = Object.keys(res.data)
            const quote = res.data[keys[0]] as Constants.FullQuoteData
            expect(quote.last_trade_time).toBeDefined
            expect(quote.last_trade_time).toEqual(1681122520)
        })
    })

    describe('historical data should be available', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.historical_candles(Constants.ExchangeTypes.NSE_EQUITY, 22, to, from, Constants.Resolutions.DAY)
            expect(res.s).toBeDefined
        })
    })

    describe('order modification is success', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const request: Constants.ModifyOrderRequest = {
                quantity: 2,
                price: 1800,
                variety: Constants.VarietyTypes.REGULAR_MARKET_ORDER,
                traded_quantity: 0,
                validity: Constants.ValidityTypes.FULL_DAY
            }
            const res = await api.modify_order("test", request)
            expect(res.data).toBeDefined
            expect(res.data.order_id).toBeDefined
        })
    })

    describe('gtt modification is success', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const request: Constants.ModifyGttRequest = {
                quantity: 2,
                price: 1800,
                id: 1
            }
            const res = await api.modify_gtt_order("test", request)
            console.log(res.data?.order_id)
            expect(res.data).toBeDefined
            expect(res.data.order_id).toBeDefined
        })
    })

    describe('multiple orders cancel is success', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.cancel_multiple_orders(["test1", "test2"])
            expect(res.data).toBeDefined
            expect((res.data.length)).toBeGreaterThan(0)
        })
    })

    describe('cancel iceberg order is success', () => {
        it("is success", async () => {
            // expect.assertions(2)
            const res = await api.cancel_iceberg_order("test")
            expect(res.status).toBeDefined
            expect((res.message)).toBeDefined
        })
    })

    describe("set access token sets the access token", () => {
        api.set_access_token("test")
        expect(api.access_token).toEqual("test")
    })

    describe("iceberg order modification",()=>{
        it("is success", async () => {
            const request: Constants.ModifyIcebergOrderRequest = {
                price: 1800,
                trigger_price: 1800,
                traded_quantity: 0
            }
            const res = await api.modify_iceberg_order("test", request)
            expect(res.message).toBeDefined
            expect(res.status).toBeDefined
        })
    })

    describe("modify regular order tags",()=>{
        it("is success", async () => {
            const res = await api.modify_regular_order_tags("test", [1,2])
            expect(res.message).toBeDefined
            expect(res.status).toBeDefined
        })
    })
    describe("modify gtt order tags",()=>{
        it("is success", async () => {
            const res = await api.modify_gtt_order_tags("test", [1,2])
            expect(res.message).toBeDefined
            expect(res.status).toBeDefined
        })
    })
}

function constructUrl(templateUrl: string, ...params: string[]): string {
    return params.reduce((acc, param) => acc.replace('%s', param), templateUrl);
}
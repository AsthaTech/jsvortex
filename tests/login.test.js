"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/index"));
const Constants = __importStar(require("../src/types"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const nock = require("nock");
const mockDir = "./vortex-mocks";
function parseJson(fileName) {
    // read and parse mock json file
    var rawdata = fs.readFileSync(path.join(__dirname, mockDir, fileName));
    var mockData = JSON.parse(rawdata.toString());
    return mockData;
}
runtests();
function runtests() {
    var api = new index_1.default.VortexAPI("TYB7g0bdJFvvQOfIXsgquaDfupLieYZlOHNMRAeO", "dev_hK7M2HWR");
    nock(api.base_url)
        .get("/user/funds")
        .reply(200, parseJson("funds.json"))
        .get("/portfolio/positions")
        .reply(200, parseJson("positions.json"))
        .get("/portfolio/holdings")
        .reply(200, parseJson("holdings.json"))
        .get("/orders?limit=20&offset=1")
        .reply(200, parseJson("orders.json"))
        .post("/orders/regular")
        .reply(200, parseJson("order.json"))
        .post("/margins/order")
        .reply(200, parseJson("margin.json"));
    describe('funds', () => {
        it("is success", () => __awaiter(this, void 0, void 0, function* () {
            // expect.assertions(2)
            const res = yield api.funds();
            console.log(res);
            expect(res.nse).toBeDefined;
            expect(res.mcx).toBeDefined;
        }));
    });
    describe('holdings', () => {
        it("is success", () => __awaiter(this, void 0, void 0, function* () {
            // expect.assertions(2)
            const res = yield api.holdings();
            console.log(res);
            expect(res.data).toBeDefined;
        }));
    });
    describe('positions', () => {
        it("is success", () => __awaiter(this, void 0, void 0, function* () {
            // expect.assertions(2)
            const res = yield api.positions();
            console.log(res);
            expect(res.data).toBeDefined;
        }));
    });
    describe('order book', () => {
        it("is success", () => __awaiter(this, void 0, void 0, function* () {
            // expect.assertions(2)
            const res = yield api.orders(20, 1);
            console.log(res);
            expect(res.orders).toBeDefined;
        }));
    });
    describe('order placement', () => {
        it("is success", () => __awaiter(this, void 0, void 0, function* () {
            // expect.assertions(2)
            const res = yield api.placeOrder(Constants.ExchangeTypes.NSE_EQUITY, 22, Constants.TransactionTypes.BUY, Constants.ProductTypes.DELIVERY, Constants.VarietyTypes.REGULAR_MARKET_ORDER, 1, 1800, 0, 0, Constants.ValidityTypes.FULL_DAY);
            console.log(res);
            expect(res.data).toBeDefined;
            expect(res.data.orderId).toBeDefined;
        }));
    });
    describe('order margin required', () => {
        it("is success", () => __awaiter(this, void 0, void 0, function* () {
            // expect.assertions(2)
            const res = yield api.get_order_margin(Constants.ExchangeTypes.NSE_EQUITY, 22, Constants.TransactionTypes.BUY, Constants.ProductTypes.DELIVERY, Constants.VarietyTypes.REGULAR_MARKET_ORDER, 1, 1800, Constants.OrderMarginModes.NEW_ORDER);
            console.log(res);
            expect(res.available).toBeDefined;
            expect(res.required).toBeDefined;
        }));
    });
}

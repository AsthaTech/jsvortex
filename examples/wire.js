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
Object.defineProperty(exports, "__esModule", { value: true });
const VortexFeed = __importStar(require("../src/api_feed"));
const Constants = __importStar(require("../src/types"));
const JSONbig = __importStar(require("json-bigint"));
const wire = new VortexFeed.VortexFeed("eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODY5NjkwMDAsImp0aSI6ImF1dGgiLCJpYXQiOjE2ODY4OTExMDksImlzcyI6IkFzdGhhVHJhZGUiLCJzdWIiOiI2MDBTMTg3MSIsImRldmljZUlkIjoiYXBpLWNsaWVudCIsImFwcGxpY2F0aW9uSWQiOiJkZXZfaEs3TTJIV1IiLCJpcCI6IjEzLjIzNS43LjE0Iiwic2NvcGUiOiJwcm9maWxlLnJlYWQsb3JkZXJzLnJlYWQsb3JkZXJzLndyaXRlLGhvbGRpbmdzLnJlYWQscG9zaXRpb25zLnJlYWQscG9zaXRpb25zLndyaXRlLGZ1bmRzLnJlYWQsdHJhZGVzLnJlYWQsbWFyZ2lucy5yZWFkLGRhdGEucmVhZCJ9.eQpI_VFkujOqTPOdZKq11aSfMW8NtH3bYOQkh30kjSQaGzsHId6j3T3D6GcJ6b-6VIuQpPF809eoEqaVtp4OY40XirVn4kwSsWEty3a4qFP053eImO02wd3zpAY_rXy2u97YaNxzuTdEDT5w9j6yHxxXYi2BnQebpUqGn2bFR7UY0VRZpEYrh77tRq1LYL_ZBwBEKXOJw1vdHpPnbMs7eil2SyRvkZzfSaIhjopSz6gRhq8xcLtgD2AWmiZjfMWC8575Df-GPn4rW-3yi-A1QOgyHsFXtseSHZSi9zh_LXVgo4nwRudNQA6sktn4Djl2CoMIsPUAcVaS3_iDq_XtFA7mrdeeMQMC7qhy4qIXNiZAoetDyGXtR6lbJwH_XVplWddN5hU1NOo_fkY55wGjL1ZABqz420D9bllQLeFXgV_KWL9waDZZf4GOGvyyTuVxntgjSiQGYhcOFQmup-irlTxSCH7SJkRXeQPcsAGJhsTeKrhpH2O1myEBHRJ-qUKq", true, true);
wire.connect();
wire.on("price_update", onPriceUpdate);
wire.on("error", printer);
wire.on("close", printer);
wire.on("connect", () => {
    wire.subscribe(Constants.ExchangeTypes.NSE_EQUITY, 26000, Constants.QuoteModes.OHLCV);
    wire.subscribe(Constants.ExchangeTypes.NSE_EQUITY, 26009, Constants.QuoteModes.OHLCV);
});
console.log(wire.connected());
function onPriceUpdate(updates) {
    console.log(JSONbig.stringify(updates));
}
function printer(e) {
    console.log(e);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderMarginModes = exports.ValidityTypes = exports.VarietyTypes = exports.ProductTypes = exports.TransactionTypes = exports.ExchangeTypes = exports.QuoteModes = exports.Resolutions = void 0;
var Resolutions;
(function (Resolutions) {
    Resolutions["MIN_1"] = "1";
    Resolutions["MIN_2"] = "2";
    Resolutions["MIN_3"] = "3";
    Resolutions["MIN_4"] = "4";
    Resolutions["MIN_5"] = "5";
    Resolutions["MIN_10"] = "10";
    Resolutions["MIN_15"] = "15";
    Resolutions["MIN_30"] = "30";
    Resolutions["MIN_45"] = "45";
    Resolutions["MIN_60"] = "60";
    Resolutions["MIN_120"] = "120";
    Resolutions["MIN_180"] = "180";
    Resolutions["MIN_240"] = "240";
    Resolutions["DAY"] = "1D";
    Resolutions["WEEK"] = "1W";
    Resolutions["MONTH"] = "1M";
})(Resolutions || (exports.Resolutions = Resolutions = {}));
var QuoteModes;
(function (QuoteModes) {
    QuoteModes["LTP"] = "ltp";
    QuoteModes["FULL"] = "full";
    QuoteModes["OHLCV"] = "ohlcv";
})(QuoteModes || (exports.QuoteModes = QuoteModes = {}));
var ExchangeTypes;
(function (ExchangeTypes) {
    ExchangeTypes["NSE_FO"] = "NSE_FO";
    ExchangeTypes["NSE_EQUITY"] = "NSE_EQ";
    ExchangeTypes["NSE_CURRENCY"] = "NSE_CD";
    ExchangeTypes["MCX"] = "MCX_FO";
})(ExchangeTypes || (exports.ExchangeTypes = ExchangeTypes = {}));
var TransactionTypes;
(function (TransactionTypes) {
    TransactionTypes["BUY"] = "BUY";
    TransactionTypes["SELL"] = "SELL";
})(TransactionTypes || (exports.TransactionTypes = TransactionTypes = {}));
var ProductTypes;
(function (ProductTypes) {
    ProductTypes["INTRADAY"] = "INTRADAY";
    ProductTypes["DELIVERY"] = "DELIVERY";
    ProductTypes["MTF"] = "MTF";
})(ProductTypes || (exports.ProductTypes = ProductTypes = {}));
var VarietyTypes;
(function (VarietyTypes) {
    VarietyTypes["REGULAR_LIMIT_ORDER"] = "RL";
    VarietyTypes["REGULAR_MARKET_ORDER"] = "RL-MKT";
    VarietyTypes["STOP_LIMIT_ORDER"] = "SL";
    VarietyTypes["STOP_MARKET_ORDER"] = "SL-MKT";
})(VarietyTypes || (exports.VarietyTypes = VarietyTypes = {}));
var ValidityTypes;
(function (ValidityTypes) {
    ValidityTypes["FULL_DAY"] = "DAY";
    ValidityTypes["IMMEDIATE_OR_CANCEL"] = "IOC";
    ValidityTypes["AFTER_MARKET"] = "AMO";
})(ValidityTypes || (exports.ValidityTypes = ValidityTypes = {}));
var OrderMarginModes;
(function (OrderMarginModes) {
    OrderMarginModes["NEW_ORDER"] = "NEW";
    OrderMarginModes["MODIFY_ORDER"] = "MODIFY";
})(OrderMarginModes || (exports.OrderMarginModes = OrderMarginModes = {}));

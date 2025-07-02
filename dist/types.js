"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URITag = exports.URITags = exports.URIMTFInterestReport = exports.URIPnLReport = exports.URITurnoverDetailsReport = exports.URITurnoverSummaryReport = exports.URITradeReport = exports.URIPayoffStrategies = exports.URIBuildStrategies = exports.URIStrategies = exports.URIOptionChain = exports.URIHistory = exports.URIQuotes = exports.URIBasketMargin = exports.URIOrderMargin = exports.URIWithdrawal = exports.URIBrokerage = exports.URIBanks = exports.URIFunds = exports.URIHoldings = exports.URIConvertposition = exports.URIPositions = exports.URITrades = exports.URIOrderHistory = exports.URIMultiCancelrders = exports.URIOrderBook = exports.URIGttOrderBook = exports.URIDeleteMultipleOrder = exports.URIDeleteOrder = exports.URIModifyOrderTags = exports.URIModifyOrder = exports.URIPlaceOrder = exports.URIInstruments = exports.URISession = exports.URILogin = exports.OrderMarginModes = exports.ValidityTypes = exports.TrailJumpTypes = exports.VarietyTypes = exports.ProductTypes = exports.TransactionTypes = exports.ExchangeTypes = exports.QuoteModes = exports.Resolutions = exports.OptionType = exports.GttOrderStatus = exports.InstrumentName = void 0;
var InstrumentName;
(function (InstrumentName) {
    InstrumentName["EQIDX"] = "EQIDX";
    InstrumentName["COM"] = "COM";
    InstrumentName["EQUITIES"] = "EQUITIES";
    InstrumentName["FUTCOM"] = "FUTCOM";
    InstrumentName["FUTCUR"] = "FUTCUR";
    InstrumentName["FUTIDX"] = "FUTIDX";
    InstrumentName["FUTIRC"] = "FUTIRC";
    InstrumentName["FUTIRT"] = "FUTIRT";
    InstrumentName["FUTSTK"] = "FUTSTK";
    InstrumentName["OPTCUR"] = "OPTCUR";
    InstrumentName["OPTFUT"] = "OPTFUT";
    InstrumentName["OPTIDX"] = "OPTIDX";
    InstrumentName["OPTIRC"] = "OPTIRC";
    InstrumentName["OPTSTK"] = "OPTSTK";
    InstrumentName["UNDCUR"] = "UNDCUR";
})(InstrumentName || (exports.InstrumentName = InstrumentName = {}));
var GttOrderStatus;
(function (GttOrderStatus) {
    GttOrderStatus["Triggered"] = "triggered";
    GttOrderStatus["Active"] = "active";
    GttOrderStatus["Cancelled"] = "cancelled";
    GttOrderStatus["Expired"] = "expired";
    GttOrderStatus["Completed"] = "completed";
})(GttOrderStatus || (exports.GttOrderStatus = GttOrderStatus = {}));
var OptionType;
(function (OptionType) {
    OptionType["Call"] = "CE";
    OptionType["Put"] = "PE";
})(OptionType || (exports.OptionType = OptionType = {}));
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
    ExchangeTypes["BSE_FO"] = "BSE_FO";
    ExchangeTypes["NSE_EQUITY"] = "NSE_EQ";
    ExchangeTypes["BSE_EQUITY"] = "BSE_EQ";
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
var TrailJumpTypes;
(function (TrailJumpTypes) {
    TrailJumpTypes["PERCENT"] = "Percent";
    TrailJumpTypes["POINT"] = "Point";
})(TrailJumpTypes || (exports.TrailJumpTypes = TrailJumpTypes = {}));
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
exports.URILogin = "/user/login";
exports.URISession = "/user/session";
exports.URIInstruments = "/data/instruments";
exports.URIPlaceOrder = "/trading/orders/%s"; // "/trading/orders/regular"
exports.URIModifyOrder = "/trading/orders/%s/%s"; // "/trading/orders/{{order_type}}/{order_id}"
exports.URIModifyOrderTags = "/trading/orders/%s/%s/tags"; // "/trading/orders/{{order_type}}/{order_id}/tags"
exports.URIDeleteOrder = "/trading/orders/%s/%s"; // "/trading/orders/{{order_type}}/{order_id}"
exports.URIDeleteMultipleOrder = "/trading/orders/%s/multi_delete"; // "/trading/orders/{{order_type}}/{order_id}"
exports.URIGttOrderBook = "/trading/orders/gtt"; // "/trading/orders/gtt"
exports.URIOrderBook = "/trading/orders"; // "/trading/orders"
exports.URIMultiCancelrders = "/trading/orders/regular/multi_delete"; // "/trading/orders/regular/multi_delete"
exports.URIOrderHistory = "/trading/orders/%s"; // "/trading/orders/{order_id}"
exports.URITrades = "/trading/trades";
exports.URIPositions = "/trading/portfolio/positions";
exports.URIConvertposition = "/trading/portfolio/positions";
exports.URIHoldings = "/trading/portfolio/holdings";
exports.URIFunds = "/user/funds";
exports.URIBanks = "/user/profile/banks";
exports.URIBrokerage = "/user/profile/brokerage";
exports.URIWithdrawal = "/user/funds/withdrawal";
exports.URIOrderMargin = "/margins/order";
exports.URIBasketMargin = "/margins/basket";
exports.URIQuotes = "/data/quote";
exports.URIHistory = "/data/history";
exports.URIOptionChain = "/strategies/option_chain";
exports.URIStrategies = "/strategies";
exports.URIBuildStrategies = "/strategies/build";
exports.URIPayoffStrategies = "/strategies/payoff";
exports.URITradeReport = "/reports/trades/%s?from_date=%s&to_date=%s";
exports.URITurnoverSummaryReport = "/reports/turnover/summary/%s?from_date=%s&to_date=%s";
exports.URITurnoverDetailsReport = "/reports/turnover/details/%s?from_date=%s&to_date=%s";
exports.URIPnLReport = "/reports/pnl/%s?from_date=%s&to_date=%s";
exports.URIMTFInterestReport = "/reports/mtf_interest/%s?from_date=%s&to_date=%s";
exports.URITags = "/reports/tags";
exports.URITag = "/reports/tags/%s";

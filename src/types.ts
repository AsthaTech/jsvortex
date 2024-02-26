export interface FullQuoteData {
    exchange?: ExchangeTypes | string,
    token?: number,
    last_trade_time?: number;
    last_update_time?: number;
    last_trade_price?: number;
    volume?: number;
    average_trade_price?: number;
    total_buy_quantity?: bigint;
    total_sell_quantity?: bigint;
    open_interest?: number;
    open_price?: number;
    high_price?: number;
    low_price?: number;
    close_price?: number;
    last_trade_quantity?: number;
    depth?: {
        buy: {
            price: number;
            quantity: number;
            orders?: number;
        }[];
        sell: {
            price: number;
            quantity: number;
            orders?: number;
        }[];
    };
    dpr_high?: number;
    dpr_low?: number;
}

export interface OhlcvQuoteData {
    exchange?: ExchangeTypes | string,
    token?: number,
    last_trade_price?: number;
    last_trade_time?: number;
    volume?: number;
    open_price?: number;
    high_price?: number;
    low_price?: number;
    close_price?: number;
}

export interface LtpQuoteData {
    exchange?: ExchangeTypes | string,
    token?: number,
    last_trade_price?: number;
}

export interface QuoteResponse {
    status: string;
    data: {
        [instrument: string]: FullQuoteData | LtpQuoteData | OhlcvQuoteData | any;
    };
}

export interface OrderMarginResponse {
    status: string;
    required_margin: number;
    available_margin: number;
}
export interface BasketMarginResponse {
    status: string;
    required_margin: number;
    initial_margin: number;
}

export interface FundsResponse {
    nse: FundDetails;
    mcx: FundDetails;
}

export interface HistoricalResponse {
    s: string;
    t: number[],
    o: number[],
    h: number[],
    l: number[],
    c: number[],
    v: number[],
}
export enum InstrumentName {
    EQIDX = "EQIDX",
    COM = "COM",
    EQUITIES = "EQUITIES",
    FUTCOM = "FUTCOM",
    FUTCUR = "FUTCUR",
    FUTIDX = "FUTIDX",
    FUTIRC = "FUTIRC",
    FUTIRT = "FUTIRT",
    FUTSTK = "FUTSTK",
    OPTCUR = "OPTCUR",
    OPTFUT = "OPTFUT",
    OPTIDX = "OPTIDX",
    OPTIRC = "OPTIRC",
    OPTSTK = "OPTSTK",
    UNDCUR = "UNDCUR",
}

export enum GttOrderStatus {
    Triggered = "triggered",
    Active = "active",
    Cancelled = "cancelled",
    Expired = "expired",
    Completed = "completed",
}
export enum OptionType {
    Call = "CE",
    Put = "PE",
}
export interface GttOrderbookResponse {
    status: string;
    data: GttOrderResponse[];
}

interface GttOrderResponse {
    id: string;
    token: number;
    exchange: ExchangeTypes;
    symbol: string;
    series: string;
    instrument_name: InstrumentName;
    expiry_date: string;
    strike_price: number;
    option_type: OptionType;
    lot_size: number;
    trigger_type: GttTriggerType;
    transaction_type: TransactionTypes;
    tag_ids?: number[];
    orders: GttOrderResponseOrders[];
}

interface GttOrderResponseOrders {
    id: number;
    product: ProductTypes;
    variety: VarietyTypes;
    transaction_type: TransactionTypes;
    price: number;
    trigger_price: number;
    quantity: number;
    status: GttOrderStatus;
    created_at: Date;
    updated_at: Date;
    trigerred_at: Date;
}

export interface FundDetails {
    deposit: number;
    funds_transferred: number;
    collateral: number;
    credit_for_sale: number;
    option_credit_for_sale: number;
    limit_utilization: number;
    funds_withdrawn: number;
    mtm_and_booked_loss: number;
    booked_profit: number;
    total_trading_power: number;
    total_utilization: number;
    net_available: number;
    withdrawable_balance: number;
}
export interface Holding {
    isin: string;
    nse?: {
        token: number;
        exchange: ExchangeTypes;
        symbol: string;
    };
    bse?: {
        token: number;
        exchange: ExchangeTypes;
        symbol: string;
    };
    total_free: number;
    dp_free: number;
    pool_free: number;
    t1_quantity: number;
    average_price: number;
    last_price: number;
    product: string;
    collateral_quantity: number;
    collateral_value: number;
}

export interface HoldingsResponse {
    status: string;
    message?: string;
    data: Holding[];
}

export interface PositionResponse {
    status: string;
    data: {
        net: Position[];
        day: Position[];
    };
}

export interface ConvertPositionResponse {
    status: string,
    code: string,
    message: string
}
export interface Position {
    exchange: ExchangeTypes;
    symbol: string;
    expiry_date: string;
    option_type: OptionType;
    strike_price: number;
    token: number;
    product: ProductTypes;
    quantity: number;
    overnight_buy_value: number;
    overnight_sell_value: number;
    overnight_average_price: number;
    lot_size: number;
    multiplier: number;
    average_price: number;
    value: number;
    buy_value: number;
    sell_value: number;
    buy_quantity: number;
    sell_quantity: number;
    buy_price: number;
    sell_price: number;
}

export interface Order {
    order_id: string;
    exchange: ExchangeTypes;
    token: number;
    order_number: string;
    status: string;
    error_reason: string;
    transaction_type: TransactionTypes;
    product: ProductTypes;
    variety: VarietyTypes;
    total_quantity: number;
    pending_quantity: number;
    traded_quantity: number;
    disclosed_quantity: number;
    disclosed_quantity_remaining: number;
    order_price: number;
    trigger_price: number;
    traded_price?: number;
    validity: ValidityTypes;
    symbol: string;
    series: string;
    instrument_name: InstrumentName;
    expiry_date: string;
    strike_price: number;
    option_type: OptionType;
    lot_size: number;
    order_created_at: string;
    initiated_by: string;
    modified_by: string;
    is_amo: boolean;
    order_identifier?: string;
    tags_ids: number[];
    middleware_order_id: number;
    iceberg?: OrderBookIcebergInfo;
    gtt?: OrderBookGttInfo;
}

interface OrderBookIcebergInfo {
    iceberg_order_id: string;
    iceberg_sequence: number;
    legs: number;
}
interface OrderBookGttInfo {
    trigger_type: GttTriggerType;
    sl_trigger_percent?: number;
    profit_trigger_percent?: number;
}

export interface OrderBookResponse {
    status: string;
    orders: Order[];
    metadata: {
        total_records: number;
        all_records: number;
        completed_records: number;
        open_records: number;
    };
}

export interface OrderHistoryResponse {
    status: string;
    orders: OrderHistory[];
    metadata: {
        total_records: number;
    };
}

export interface OrderHistory {
    order_id: string;
    exchange: ExchangeTypes;
    token: number;
    order_number: string;
    status: string;
    error_reason: string;
    transaction_type: TransactionTypes;
    product: ProductTypes;
    variety: VarietyTypes;
    total_quantity: number;
    pending_quantity: number;
    traded_quantity: number;
    disclosed_quantity: number;
    order_price: number;
    trigger_price: number;
    validity: ValidityTypes;
    validity_days: number;
    symbol: string;
    series: string;
    instrument_name: string;
    expiry_date: string;
    strike_price: number;
    option_type: string;
    lot_size: number;
    order_created_at: string;
    initiated_by: string;
    modified_by: string;
    is_amo: boolean;
    order_identifier?: string;
}
export interface LoginResponse {
    status: string;
    data: {
        access_token: string;
        user_name: string;
        login_time: string;
        email: string;
        mobile: string;
        exchanges: string[];
        product_types: string[];
        others: {
            userCode: string;
            POA: number;
        };
        user_id: string;
        tradingActive: boolean;
    };
}

export interface MultipleOrderCancelResponse {
    status: string;
    data: OrderBookResponse[];
}

export interface OrderResponse {
    status: string;
    code: string;
    message: string;
    data: {
        order_id: string;
    };
}
export enum Resolutions {
    MIN_1 = "1",
    MIN_2 = "2",
    MIN_3 = "3",
    MIN_4 = "4",
    MIN_5 = "5",
    MIN_10 = "10",
    MIN_15 = "15",
    MIN_30 = "30",
    MIN_45 = "45",
    MIN_60 = "60",
    MIN_120 = "120",
    MIN_180 = "180",
    MIN_240 = "240",
    DAY = "1D",
    WEEK = "1W",
    MONTH = "1M"
}
export enum QuoteModes {
    LTP = "ltp",
    FULL = "full",
    OHLCV = "ohlcv"
}
export enum ExchangeTypes {
    NSE_FO = "NSE_FO",
    NSE_EQUITY = "NSE_EQ",
    NSE_CURRENCY = "NSE_CD",
    MCX = "MCX_FO"
}

export enum TransactionTypes {
    BUY = "BUY",
    SELL = "SELL",
}

export enum ProductTypes {
    INTRADAY = "INTRADAY",
    DELIVERY = "DELIVERY",
    MTF = "MTF",
}

export enum VarietyTypes {
    REGULAR_LIMIT_ORDER = "RL",
    REGULAR_MARKET_ORDER = "RL-MKT",
    STOP_LIMIT_ORDER = "SL",
    STOP_MARKET_ORDER = "SL-MKT"
}

export enum ValidityTypes {
    FULL_DAY = "DAY",
    IMMEDIATE_OR_CANCEL = "IOC",
    AFTER_MARKET = "AMO"
}

export enum OrderMarginModes {
    NEW_ORDER = "NEW",
    MODIFY_ORDER = "MODIFY"
}

export interface Trade {
    order_id: string;
    exchange: ExchangeTypes;
    token: number;
    trade_no: string;
    exchange_order_no: string;
    transaction_type: TransactionTypes;
    product: ProductTypes;
    variety: VarietyTypes;
    trade_quantity: number;
    trade_price: number;
    symbol: string;
    series: string;
    instrument_name: string;
    expiry_date: string;
    strike_price: number;
    option_type: string;
    traded_at: string;
    initiated_by: string;
    modified_by: string;
    order_identifier?: string;
}
export interface TradeBookResponse {
    status: string;
    trades: Trade[];
    metadata: {
        total_records: number;
    };
}

export interface ModifyOrderTagsResponse {
    status: string;
    message: string;
}

export interface IcebergOrderResponse {
    status: string;
    message: string;
}

export interface GttOrderModificationResponse {
    status: string;
    message: string;
    data: {
        order_id: string;
    };
}

export interface GttLegs {
    // Optional: Stop loss trigger percentage.
    sl_trigger_percent?: number;
    // Optional: Profit trigger percentage.
    profit_trigger_percent?: number;
}

export interface PlaceIcebergOrderResponse{
    status?: string ;
    message?: string ;
    data?: {
        first_order_id?: string,
        iceberg_order_id?: string
    },
}


export interface PlaceGttLegRequest {
    // Required: Quantity of the leg.
    quantity: number;
    // Required: Price of the leg.
    price: number;
    // Required: Trigger price for the leg.
    trigger_price: number;
    // Required: Type of product for the leg.
    product: ProductTypes;
}

export interface PlaceGttOrderRequest {
    // Required: Exchange type.
    exchange: ExchangeTypes;
    // Required: Token of the underlying instrument.
    token: number;
    // Required: Type of transaction.
    transaction_type: TransactionTypes;
    // Required: Quantity of the order.
    quantity?: number;
    // Required: Trigger price for the order.
    trigger_price?: number;
    // Required: Price of the order.
    price?: number;
    // Required: Identifier for the order.
    order_identifier?: string;
    // Required: Type of GTT trigger.
    gtt_trigger_type: GttTriggerType;
    // Required: Type of product.
    product: ProductTypes;
    // Optional: Stop loss leg of the GTT order.
    stoploss?: PlaceGttLegRequest;
    // Optional: Profit leg of the GTT order.
    profit?: PlaceGttLegRequest;
    // Required: IDs of tags associated with the order.
    tag_ids?: number[];
}

export interface BasketMarginOrder {
    // Required: Exchange type.
    exchange: ExchangeTypes;
    // Required: Token of the underlying instrument.
    token: number;
    // Required: Type of transaction.
    transaction_type: TransactionTypes;
    // Required: Type of product.
    product: ProductTypes;
    // Required: Type of variety.
    variety: VarietyTypes;
    // Required: Quantity of the order.
    quantity: number;
    // Required: Price of the order.
    price: number;
}

export interface BasketMarginRequest {
    orders: BasketMarginOrder[];
}

export interface ConvertPositionRequest {
    // Required: Exchange type.
    exchange: ExchangeTypes;
    // Required: Token of the underlying instrument.
    token: number;
    // Required: Type of transaction.
    transaction_type: TransactionTypes;
    // Required: Quantity of the position to convert.
    quantity: number;
    // Required: Old product type of the position.
    old_product: ProductTypes;
    // Required: New product type to convert the position to.
    new_product: ProductTypes;
}

export interface ModifyGttRequest {
    // Required: Identifier of the GTT order to modify.
    id: number;
    // Required: New trigger price for the GTT order.
    trigger_price?: number;
    // Required: New price for the GTT order.
    price?: number;
    // Required: New quantity for the GTT order.
    quantity?: number;
}

export interface PlaceIcebergOrderRequest {
    // Required: Exchange type.
    exchange: ExchangeTypes;
    // Required: Token of the underlying instrument.
    token: number;
    // Required: Type of transaction.
    transaction_type: TransactionTypes;
    // Required: Type of product.
    product: ProductTypes;
    // Required: Type of variety.
    variety: VarietyTypes;
    // Required: Quantity of the order.
    quantity: number;
    // Optional if market order. Price of the order.
    price?: number;
    // Optional if not stoploss order. Trigger price for the order.
    trigger_price: number;
    // Optional: Your identifier for the order.
    order_identifier?: string;
    // Required: Validity type for the order.
    validity: ValidityTypes;
    // Required: Number of legs for the order.
    legs: number;
    // IDs of tags associated with the order.
    tag_ids?: number[];
}

export interface FundWithdrawalRequest {
    // Required: Bank account number.
    bank_account_number: string;
    // Required: IFSC code.
    ifsc: string;
    // Required: Amount to withdraw.
    amount: number;
    // Required: Exchange type.
    exchange: ExchangeTypes;
}

export interface FundWithdrawalCancelRequest {
    // Required: Transaction ID.
    transaction_id: string;
    // Required: Exchange type.
    exchange: ExchangeTypes;
    // Required: Amount of the withdrawal.
    amount: number;
}

export interface TagRequest {
    // Name of the tag.
    name: string;
    // Description of the tag.
    description: string;
}

export interface ModifyIcebergOrderRequest {
    // Required: Price of the order.
    price: number;
    // Required: Trigger price for the order.
    trigger_price: number;
    // Required: Quantity already traded.
    traded_quantity: number;
}

export interface StrategyBuilderRequest {
    // Required: Token of the underlying instrument.
    token: number;
    // Required: Symbol of the underlying instrument.
    symbol: string;
    // Required: Prediction type. Should be one of ["ABOVE", "BELOW", "BETWEEN"]
    prediction: PredictionType;
    // Required: Expiry date of options in format: YYYYMMDD
    expiry_date: string;
    // Price range for the strategy.
    price_range: number[];
}

export interface PayoffOption {
    // Required: Token of the underlying instrument.
    token: number;
    // Required: Action for the option.
    action: PayoffAction;
    // Required: Quantity of the option.
    quantity: number;
    // Optional: Last traded price for the option.
    last_trade_price?: number;
}

export interface PayoffRequest {
    // Required: Symbol for the underlying asset.
    symbol: string;
    // Required: Exchange type.
    exchange: ExchangeTypes;
    // Required: Legs of the trading strategy.
    legs: PayoffOption[];
    // Optional: Number of days to expiry.
    days_to_expiry?: number;
    // Optional: Current profit or loss.
    current_pnl?: number;
}

export type GttTriggerType = "single" | "oco"; // Single trigger type or One Cancels the Other (OCO) trigger type.

export type PredictionType = "ABOVE" | "BELOW" | "BETWEEN"; // Type of prediction for a trading strategy.
export type PayoffAction = "BUY" | "SELL"; // Action for a trading strategy.

export interface ExchangeAuthTokenRequest {
    checksum: string;
    applicationId: string;
    token: string;
}

export interface MultipleOrderCancelRequest {
    order_ids: string[];
}

export interface PlaceOrderRequest {
    // Required: Exchange type.
    exchange: ExchangeTypes;
    // Required: Token of the underlying instrument.
    token: number;
    // Required: Type of transaction.
    transaction_type: TransactionTypes;
    // Required: Type of product.
    product: ProductTypes;
    // Required: Type of variety.
    variety: VarietyTypes;
    // Required: Quantity of the order.
    quantity: number;
    // Optional if market order. Price of the order.
    price?: number;
    // Optional if not stoploss order. Trigger price for the order.
    trigger_price?: number;
    // Optional: Your identifier for the order.
    order_identifier?: string;
    // Optional: Disclosed quantity for the order.
    disclosed_quantity?: number;
    // Required: Validity type for the order.
    validity: ValidityTypes;
    // Optional: Number of validity days.
    validity_days?: number;
    // Optional: Flag indicating if the order is an after-market order.
    is_amo?: boolean;
    // Optional: Good 'til Triggered (GTT) legs.
    gtt?: GttLegs;
    // Optional: IDs of tags associated with the order.
    tag_ids?: number[];
}

export interface OrderMarginRequest {
    // Required: Exchange type.
    exchange: ExchangeTypes;
    // Required: Token of the underlying instrument.
    token: number;
    // Required: Type of transaction.
    transaction_type: TransactionTypes;
    // Required: Type of product.
    product: ProductTypes;
    // Required: Type of variety.
    variety: VarietyTypes;
    // Required: Quantity of the order.
    quantity: number;
    // Required: Price of the order.
    price: number;
    // Required: Old price of the order.
    old_price: number;
    // Required: Old quantity of the order.
    old_quantity: number;
    // Required: Mode of margin calculation.
    mode: OrderMarginModes;
}

export interface ModifyOrderRequest {
    // Required: Type of variety.
    variety: VarietyTypes;
    // Required: Quantity of the order.
    quantity: number;
    // Required: Quantity which has already been traded according to you. This is important.
    traded_quantity: number;
    // Optional if market order. Price of the order.
    price?: number;
    // Optional if not stoploss order. Trigger price for the order.
    trigger_price?: number;
    // Optional: Disclosed quantity for the order.
    disclosed_quantity?: number;
    // Required: Validity type for the order.
    validity: ValidityTypes;
    // Optional: Number of validity days.
    validity_days?: number;
    // Optional: IDs of tags associated with the order.
    tag_ids?: number[];
}


export const URILogin: string = "/user/login";
export const URISession: string = "/user/session";
export const URIInstruments: string = "/data/instruments";
export const URIPlaceOrder: string = "/trading/orders/%s"; // "/trading/orders/regular"
export const URIModifyOrder: string = "/trading/orders/%s/%s"; // "/trading/orders/{{order_type}}/{order_id}"
export const URIModifyOrderTags: string = "/trading/orders/%s/%s/tags"; // "/trading/orders/{{order_type}}/{order_id}/tags"
export const URIDeleteOrder: string = "/trading/orders/%s/%s"; // "/trading/orders/{{order_type}}/{order_id}"
export const URIDeleteMultipleOrder: string = "/trading/orders/%s/multi_delete"; // "/trading/orders/{{order_type}}/{order_id}"
export const URIGttOrderBook: string = "/trading/orders/gtt"; // "/trading/orders/gtt"
export const URIOrderBook: string = "/trading/orders"; // "/trading/orders"
export const URIMultiCancelrders: string = "/trading/orders/regular/multi_delete"; // "/trading/orders/regular/multi_delete"
export const URIOrderHistory: string = "/trading/orders/%s"; // "/trading/orders/{order_id}"
export const URITrades: string = "/trading/trades";
export const URIPositions: string = "/trading/portfolio/positions";
export const URIConvertposition: string = "/trading/portfolio/positions";
export const URIHoldings: string = "/trading/portfolio/holdings";
export const URIFunds: string = "/user/funds";
export const URIBanks: string = "/user/profile/banks";
export const URIBrokerage: string = "/user/profile/brokerage";
export const URIWithdrawal: string = "/user/funds/withdrawal";
export const URIOrderMargin: string = "/margins/order";
export const URIBasketMargin: string = "/margins/basket";
export const URIQuotes: string = "/data/quote";
export const URIHistory: string = "/data/history";
export const URIOptionChain: string = "/strategies/option_chain";
export const URIStrategies: string = "/strategies";
export const URIBuildStrategies: string = "/strategies/build";
export const URIPayoffStrategies: string = "/strategies/payoff";
export const URITradeReport: string = "/reports/trades/%s?from_date=%s&to_date=%s";
export const URITurnoverSummaryReport: string = "/reports/turnover/summary/%s?from_date=%s&to_date=%s";
export const URITurnoverDetailsReport: string = "/reports/turnover/details/%s?from_date=%s&to_date=%s";
export const URIPnLReport: string = "/reports/pnl/%s?from_date=%s&to_date=%s";
export const URIMTFInterestReport: string = "/reports/mtf_interest/%s?from_date=%s&to_date=%s";
export const URITags: string = "/reports/tags";
export const URITag: string = "/reports/tags/%d";
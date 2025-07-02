export interface FullQuoteData {
    exchange?: ExchangeTypes | string;
    token?: number;
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
    exchange?: ExchangeTypes | string;
    token?: number;
    last_trade_price?: number;
    last_trade_time?: number;
    volume?: number;
    open_price?: number;
    high_price?: number;
    low_price?: number;
    close_price?: number;
}
export interface LtpQuoteData {
    exchange?: ExchangeTypes | string;
    token?: number;
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
    exchange_combined: FundDetails;
}
export interface HistoricalResponse {
    s: string;
    t: number[];
    o: number[];
    h: number[];
    l: number[];
    c: number[];
    v: number[];
}
export declare enum InstrumentName {
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
    UNDCUR = "UNDCUR"
}
export declare enum GttOrderStatus {
    Triggered = "triggered",
    Active = "active",
    Cancelled = "cancelled",
    Expired = "expired",
    Completed = "completed"
}
export declare enum OptionType {
    Call = "CE",
    Put = "PE"
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
    created_at: string;
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
    status: string;
    code: string;
    message: string;
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
    sl_variety?: VarietyTypes;
    profit_variety?: VarietyTypes;
    trail_jump_point?: number;
    trail_jump_type?: TrailJumpTypes;
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
export declare enum Resolutions {
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
export declare enum QuoteModes {
    LTP = "ltp",
    FULL = "full",
    OHLCV = "ohlcv"
}
export declare enum ExchangeTypes {
    NSE_FO = "NSE_FO",
    BSE_FO = "BSE_FO",
    NSE_EQUITY = "NSE_EQ",
    BSE_EQUITY = "BSE_EQ",
    NSE_CURRENCY = "NSE_CD",
    MCX = "MCX_FO"
}
export declare enum TransactionTypes {
    BUY = "BUY",
    SELL = "SELL"
}
export declare enum ProductTypes {
    INTRADAY = "INTRADAY",
    DELIVERY = "DELIVERY",
    MTF = "MTF"
}
export declare enum VarietyTypes {
    REGULAR_LIMIT_ORDER = "RL",
    REGULAR_MARKET_ORDER = "RL-MKT",
    STOP_LIMIT_ORDER = "SL",
    STOP_MARKET_ORDER = "SL-MKT"
}
export declare enum TrailJumpTypes {
    PERCENT = "Percent",
    POINT = "Point"
}
export declare enum ValidityTypes {
    FULL_DAY = "DAY",
    IMMEDIATE_OR_CANCEL = "IOC",
    AFTER_MARKET = "AMO"
}
export declare enum OrderMarginModes {
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
    sl_trigger_percent?: number;
    sl_variety?: VarietyTypes;
    profit_trigger_percent?: number;
    profit_variety?: VarietyTypes;
    trail_jump_point?: number;
    trail_jump_type?: TrailJumpTypes;
}
export interface PlaceIcebergOrderResponse {
    status?: string;
    message?: string;
    data?: {
        first_order_id?: string;
        iceberg_order_id?: string;
    };
}
export interface PlaceGttLegRequest {
    quantity: number;
    price: number;
    trigger_price: number;
    product: ProductTypes;
}
export interface PlaceGttOrderRequest {
    exchange: ExchangeTypes;
    token: number;
    transaction_type: TransactionTypes;
    quantity?: number;
    trigger_price?: number;
    price?: number;
    order_identifier?: string;
    gtt_trigger_type: GttTriggerType;
    product: ProductTypes;
    stoploss?: PlaceGttLegRequest;
    profit?: PlaceGttLegRequest;
    tag_ids?: number[];
}
export interface BasketMarginOrder {
    exchange: ExchangeTypes;
    token: number;
    transaction_type: TransactionTypes;
    product: ProductTypes;
    variety: VarietyTypes;
    quantity: number;
    price: number;
}
export interface BasketMarginRequest {
    orders: BasketMarginOrder[];
}
export interface ConvertPositionRequest {
    exchange: ExchangeTypes;
    token: number;
    transaction_type: TransactionTypes;
    quantity: number;
    old_product: ProductTypes;
    new_product: ProductTypes;
}
export interface ModifyGttRequest {
    id: number;
    trigger_price?: number;
    price?: number;
    quantity?: number;
}
export interface PlaceIcebergOrderRequest {
    exchange: ExchangeTypes;
    token: number;
    transaction_type: TransactionTypes;
    product: ProductTypes;
    variety: VarietyTypes;
    quantity: number;
    price?: number;
    trigger_price: number;
    order_identifier?: string;
    validity: ValidityTypes;
    legs: number;
    tag_ids?: number[];
}
export interface FundWithdrawalRequest {
    bank_account_number: string;
    ifsc: string;
    amount: number;
    exchange: ExchangeTypes;
}
export interface CancelFundWithdrawalRequest {
    transaction_id: string;
    amount: number;
    exchange: ExchangeTypes;
}
export interface FundWithdrawalResponse {
    status: string;
    message: string;
    transaction_id: string;
    data: {
        transaction_id: string;
        amount: number;
        created_at: string;
        status: string;
        exchange: ExchangeTypes;
    };
}
export interface CancelFundWithdrawalResponse {
    status: string;
}
export interface FundWithdrawalCancelRequest {
    transaction_id: string;
    exchange: ExchangeTypes;
    amount: number;
}
export interface TagRequest {
    name: string;
    description: string;
}
export interface ModifyIcebergOrderRequest {
    price: number;
    trigger_price: number;
    traded_quantity: number;
}
export interface StrategyBuilderRequest {
    token: number;
    symbol: string;
    prediction: PredictionType;
    expiry_date: string;
    price_range: number[];
}
export interface PayoffOption {
    token: number;
    action: PayoffAction;
    quantity: number;
    last_trade_price?: number;
}
export interface PayoffRequest {
    symbol: string;
    exchange: ExchangeTypes;
    legs: PayoffOption[];
    days_to_expiry?: number;
    current_pnl?: number;
}
export type GttTriggerType = "single" | "oco";
export type PredictionType = "ABOVE" | "BELOW" | "BETWEEN";
export type PayoffAction = "BUY" | "SELL";
export interface ExchangeAuthTokenRequest {
    checksum: string;
    applicationId: string;
    token: string;
}
export interface MultipleOrderCancelRequest {
    order_ids: string[];
}
export interface PlaceOrderRequest {
    exchange: ExchangeTypes;
    token: number;
    transaction_type: TransactionTypes;
    product: ProductTypes;
    variety: VarietyTypes;
    quantity: number;
    price?: number;
    trigger_price?: number;
    order_identifier?: string;
    disclosed_quantity?: number;
    validity: ValidityTypes;
    validity_days?: number;
    is_amo?: boolean;
    gtt?: GttLegs;
    tag_ids?: number[];
}
export interface OrderMarginRequest {
    exchange: ExchangeTypes;
    token: number;
    transaction_type: TransactionTypes;
    product: ProductTypes;
    variety: VarietyTypes;
    quantity: number;
    price: number;
    old_price: number;
    old_quantity: number;
    mode: OrderMarginModes;
}
export interface ModifyOrderRequest {
    variety: VarietyTypes;
    quantity: number;
    traded_quantity: number;
    price?: number;
    trigger_price?: number;
    disclosed_quantity?: number;
    validity: ValidityTypes;
    validity_days?: number;
    tag_ids?: number[];
}
export interface TagModificationRequest {
    name: string;
    description: string;
}
export interface TagsResponse {
    status: string;
    data: TagData[];
}
export interface TagData {
    id: number;
    client_code: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}
export interface TagResponse {
    status: string;
    data: TagData;
}
export interface TagDeleteResponse {
    status: string;
    message: string;
}
export interface OptionChainRequest {
    symbol: string;
    exchange: ExchangeTypes;
    token: number;
    expiry_date: string;
    greeks: boolean;
}
export interface OptionChainResponse {
    status: string;
    message: string;
    response: OptionChainData;
}
export interface OptionChainData {
    symbol: string;
    has_parent_stock: boolean;
    expiry_date: string;
    expiry_dates: string[];
    options: OptionChainOptions;
}
export interface OptionChainOptions {
    exchange: ExchangeTypes;
    List: OptionChainOption[];
}
export interface OptionChainOption {
    strike_price: number;
    iv: number;
    vegas: number;
    gamma: number;
    CE: OptionDetail;
    PE: OptionDetail;
}
export interface OptionDetail {
    token: number;
    instrument_name: InstrumentName;
    lot_size: number;
    security_description: string;
    eligibility: number;
    ltp: number;
    open_interest: number;
    day_first_tick_oi: number;
    volume: number;
    delta: number;
}
export declare const URILogin: string;
export declare const URIExchangeToken: string;
export declare const URISession: string;
export declare const URIInstruments: string;
export declare const URIPlaceOrder: string;
export declare const URIModifyOrder: string;
export declare const URIModifyOrderTags: string;
export declare const URIDeleteOrder: string;
export declare const URIDeleteMultipleOrder: string;
export declare const URIGttOrderBook: string;
export declare const URIOrderBook: string;
export declare const URIMultiCancelrders: string;
export declare const URIOrderHistory: string;
export declare const URITrades: string;
export declare const URIPositions: string;
export declare const URIConvertposition: string;
export declare const URIHoldings: string;
export declare const URIFunds: string;
export declare const URIBanks: string;
export declare const URIBrokerage: string;
export declare const URIWithdrawal: string;
export declare const URIOrderMargin: string;
export declare const URIBasketMargin: string;
export declare const URIQuotes: string;
export declare const URIHistory: string;
export declare const URIOptionChain: string;
export declare const URIStrategies: string;
export declare const URIBuildStrategies: string;
export declare const URIPayoffStrategies: string;
export declare const URITradeReport: string;
export declare const URITurnoverSummaryReport: string;
export declare const URITurnoverDetailsReport: string;
export declare const URIPnLReport: string;
export declare const URIMTFInterestReport: string;
export declare const URITags: string;
export declare const URITag: string;
export {};

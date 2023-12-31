export interface FullQuoteData {
    exchange?: string, 
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
    exchange?: string, 
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
    exchange?: string, 
    token?: number,
    last_trade_price?: number;
}

export interface QuoteResponse {
    status: string;
    data: {
        [instrument: string]: FullQuoteData|LtpQuoteData|OhlcvQuoteData ;
    };
}

export interface MarginResponse {
    status: string;
    required: number;
    available: number;
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
}
export interface Holding {
    isin: string;
    nse: {
        token: number;
        exchange: ExchangeTypes;
        symbol: string;
    };
    bse: {
        token: number;
        exchange: ExchangeTypes;
        symbol: string;
    };
    total_free: number;
    dp_free: number;
    pool_free: number;
    t1_quantity: number;
    average_price: number;
    collateral_quantity: number;
    collateral_value: number;
}

export interface HoldingsResponse {
    status: string;
    data: Holding[];
}

export interface PositionResponse {
    status: string;
    data: {
        net: Position[];
        day: Position[];
    };
}

export interface ConvertPositionResponse{
    status: string, 
    code: string, 
    message: string
}
export interface Position {
    exchange: ExchangeTypes;
    symbol: string;
    expiry_date: string;
    option_type: string;
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
    traded_price: number;
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
    order_identifier: string;
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

export interface OrderHistoryResponse{
    status: string;
    data: OrderHistory[];
    metadata: {
        total_records: number; 
    };
}

export interface OrderHistory{
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
    order_identifier: string;
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

export interface OrderResponse {
    status: string;
    code: string;
    message: string;
    data: {
        orderId: string;
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
    order_identifier: string;
  }  
export interface TradeBookResponse {
    status: string;
    trades: Trade[];
    metadata: {
        total_records: number;
    };
  }
  
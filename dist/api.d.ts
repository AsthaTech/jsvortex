import * as Constants from "./types";
/**
 * VortexAPI is a class that provides methods to interact with the Vortex REST API.
 */
export declare class VortexAPI {
    private api_key;
    private application_id;
    base_url: string;
    private access_token;
    private enable_logging;
    /**
     * Creates an instance of the VortexAPI class.
     * @param api_key The API key for authentication.
     * @param application_id The application ID for the API.
     * @param base_url The base URL of the Vortex API (default: "https://vortex.restapi.asthatrade.com").
     * @param enable_logging Determines whether logging is enabled (default: false).
     */
    constructor(api_key: string, application_id: string, base_url?: string, enable_logging?: boolean);
    private _make_api_request;
    private _make_unauth_request;
    /**
    * Authenticates the user and returns a login response.
    * @param client_code The client code for authentication.
    * @param password The password for authentication.
    * @param totp The Time-based One-Time Password (TOTP) for authentication.
    * @returns A Promise that resolves to a login response.
    */
    login(client_code: string, password: string, totp: string): Promise<Constants.LoginResponse>;
    private _setup_client_code;
    /**
     * Places an order with the specified parameters.
     * @param exchange The exchange type for the order.
     * @param token The token value for the order.
     * @param transaction_type The transaction type for the order.
     * @param product The product type for the order.
     * @param variety The variety type for the order.
     * @param quantity The quantity of the order.
     * @param price The price of the order.
     * @param trigger_price The trigger price of the order.
     * @param disclosed_quantity The disclosed quantity of the order.
     * @param validity The validity type for the order.
     * @returns A Promise that resolves to an order response.
     */
    placeOrder(exchange: Constants.ExchangeTypes, token: number, transaction_type: Constants.TransactionTypes, product: Constants.ProductTypes, variety: Constants.VarietyTypes, quantity: number, price: number, trigger_price: number, disclosed_quantity: number, validity: Constants.ValidityTypes): Promise<Constants.OrderResponse>;
    /**
     * Modifies an existing order with the specified parameters.
     * @param exchange The exchange type of the order.
     * @param order_id The ID of the order to be modified.
     * @param variety The variety type for the modified order.
     * @param quantity The quantity of the modified order.
     * @param traded_quantity The traded quantity of the modified order.
     * @param price The price of the modified order.
     * @param trigger_price The trigger price of the modified order.
     * @param disclosed_quantity The disclosed quantity of the modified order.
     * @param validity The validity type for the modified order.
     * @returns A Promise that resolves to an order response.
     */
    modifyOrder(exchange: Constants.ExchangeTypes, order_id: string, variety: Constants.VarietyTypes, quantity: number, traded_quantity: number, price: number, trigger_price: number, disclosed_quantity: number, validity: Constants.ValidityTypes): Promise<Constants.OrderResponse>;
    /**
    * Cancels an order with the specified exchange and order ID.
    * @param exchange The exchange type of the order.
    * @param order_id The ID of the order to be canceled.
    * @returns A Promise that resolves to an order response.
    */
    cancel_order(exchange: Constants.ExchangeTypes, order_id: string): Promise<Constants.OrderResponse>;
    /**
    * Retrieves the order book with the specified limit and offset.
    * @param limit The maximum number of orders to retrieve.
    * @param offset The offset value for pagination.
    * @returns A Promise that resolves to an order book response.
    */
    orders(limit: number, offset: number): Promise<Constants.OrderBookResponse>;
    /**
     * Retrieves the order history for a specific order.
     * @param order_id The ID of the order to retrieve the history for.
     */
    order_history(order_id: string): Promise<void>;
    /**
    * Retrieves the positions of the user.
    * @returns A Promise that resolves to a position response.
    */
    positions(): Promise<Constants.PositionResponse>;
    /**
    * Retrieves the holdings of the user.
    * @returns A Promise that resolves to a holdings response.
    */
    holdings(): Promise<Constants.HoldingsResponse>;
    /**
     * Retrieves the funds of the user.
     * @returns A Promise that resolves to a funds response.
     */
    funds(): Promise<Constants.FundsResponse>;
    /**
     * Calculates the margin requirement for a specific order.
     * @param exchange The exchange type of the order.
     * @param token The token value for the order.
     * @param transaction_type The transaction type for the order.
     * @param product The product type for the order.
     * @param variety The variety type for the order.
     * @param quantity The quantity of the order.
     * @param price The price of the order.
     * @param mode The margin mode for the calculation.
     * @param old_quantity The old quantity for partial modification (default: 0).
     * @param old_price The old price for partial modification (default: 0).
     * @returns A Promise that resolves to a margin response.
     */
    get_order_margin(exchange: Constants.ExchangeTypes, token: number, transaction_type: Constants.TransactionTypes, product: Constants.ProductTypes, variety: Constants.VarietyTypes, quantity: number, price: number, mode: Constants.OrderMarginModes, old_quantity?: number, old_price?: number): Promise<Constants.MarginResponse>;
    /**
     * Retrieves quotes for the specified instruments.
     * @param instruments The list of instruments to retrieve quotes for.
     * @param mode The quote mode for the request.
     * @returns A Promise that resolves to a quote response.
     */
    quotes(instruments: string[], mode: Constants.QuoteModes): Promise<Constants.QuoteResponse>;
    /**
    * Retrieves historical candle data for the specified parameters.
    * @param exchange The exchange type for the historical data.
    * @param token The token value for the historical data.
    * @param to The end date/time of the historical data range.
    * @param start The start date/time of the historical data range.
    * @param resolution The resolution of the historical data.
    * @returns A Promise that resolves to a historical response.
    */
    historical_candles(exchange: Constants.ExchangeTypes, token: number, to: Date, start: Date, resolution: Constants.Resolutions): Promise<Constants.HistoricalResponse>;
}

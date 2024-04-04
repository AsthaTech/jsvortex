import * as Constants from "./types";
/**
 * VortexAPI is a class that provides methods to interact with the Vortex REST API.
 */
export declare class VortexAPI {
    private api_key;
    private application_id;
    base_url: string;
    access_token: string | null;
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
    set_access_token(accessToken: string): void;
    /**
    * @param payload PlaceOrderRequest
    * @returns A Promise that resolves to an order response.
    */
    place_order(payload: Constants.PlaceOrderRequest): Promise<Constants.OrderResponse>;
    /**
     * @param payload
     * @returns A Promise that resolves to an iceberg order response.
     */
    place_iceberg_order(payload: Constants.PlaceIcebergOrderRequest): Promise<Constants.PlaceIcebergOrderResponse>;
    /**
     * @param payload
     * @returns A Promise that resolves to an iceberg order response.
     */
    place_gtt_order(payload: Constants.PlaceGttOrderRequest): Promise<Constants.OrderResponse>;
    /**
     * Modifies an existing order with the specified parameters.
     * @param order_id The ID of the order to be modified.
     * @param payload  ModifyOrderRequest
     * @returns A Promise that resolves to an order response.
     */
    modify_order(order_id: string, payload: Constants.ModifyOrderRequest): Promise<Constants.OrderResponse>;
    /**
     * Modifies an existing iceberg order with the specified parameters.
     * @param iceberg_order_id The ID of the order to be modified.
     * @param payload  ModifyIcebergOrderRequest
     * @returns A Promise that resolves to an iceberg order response.
     */
    modify_iceberg_order(iceberg_order_id: string, payload: Constants.ModifyIcebergOrderRequest): Promise<Constants.IcebergOrderResponse>;
    /**
    * Modifies an existing gtt order with the specified parameters.
    * @param gtt_order_id The ID of the order to be modified.
    * @param payload  ModifyIcebergOrderRequest
    * @returns A Promise that resolves to an iceberg order response.
    */
    modify_gtt_order(gtt_order_id: string, payload: Constants.ModifyGttRequest): Promise<Constants.GttOrderModificationResponse>;
    /**
    * Updates tags of an already placed order.
    * @param order_id The ID of the order to be modified.
    * @param tag_ids List of tag ids to add to any order
    */
    modify_regular_order_tags(order_id: string, tag_ids: number[]): Promise<Constants.ModifyOrderTagsResponse>;
    /**
    * Updates tags of an already placed order.
    * @param gtt_order_id The ID of the order to be modified.
    * @param tag_ids List of tag ids to add to any order
    */
    modify_gtt_order_tags(gtt_order_id: string, tag_ids: number[]): Promise<Constants.ModifyOrderTagsResponse>;
    /**
    * Cancels an order with the specified order ID.
    * @param order_id The ID of the order to be canceled.
    * @returns A Promise that resolves to an order response.
    */
    cancel_order(order_id: string): Promise<Constants.OrderResponse>;
    /**
    * Cancels multiple orders with the specified order IDs.
    * @param order_ids The IDs of the order to be canceled.
    * @returns A Promise that resolves to MultipleOrderCancelResponse.
    */
    cancel_multiple_orders(order_ids: string[]): Promise<Constants.MultipleOrderCancelResponse>;
    /**
    * Cancels iceberg order with the specified order IDs.
    * @param iceberg_order_id The ID of the iceberg order to be canceled.
    * @returns A Promise that resolves to IcebergOrderResponse.
    */
    cancel_iceberg_order(iceberg_order_id: string): Promise<Constants.IcebergOrderResponse>;
    /**
    * Cancels gtt order with the specified order IDs.
    * @param gtt_order_id The ID of the gtt order to be canceled.
    * @returns A Promise that resolves to GttOrderModificationResponse.
    */
    cancel_gtt_order(gtt_order_id: string): Promise<Constants.GttOrderModificationResponse>;
    /**
    * Retrieves the order book.
    * @returns A Promise that resolves to an order book response.
    */
    orders(): Promise<Constants.OrderBookResponse>;
    /**
    * Retrieves the GTT order book.
    * @returns A Promise that resolves to a GTT order book response.
    */
    gtt_orders(): Promise<Constants.GttOrderbookResponse>;
    /**
     * Retrieves the order history for a specific order.
     * @param order_id The ID of the order to retrieve the history for.
     */
    order_history(order_id: string): Promise<Constants.OrderHistoryResponse>;
    /**
    * Retrieves the positions of the user.
    * @returns A Promise that resolves to a position response.
    */
    positions(): Promise<Constants.PositionResponse>;
    /**
    * Converts position's product type .
    * @returns A Promise that resolves to a convert position's response.
    */
    convert_position(payload: Constants.ConvertPositionRequest): Promise<Constants.ConvertPositionResponse>;
    /**
    * Retrieves the holdings of the user.
    * @returns A Promise that resolves to a holdings response.
    */
    holdings(): Promise<Constants.HoldingsResponse>;
    /**
    * Retrieves the todays's trades of the user.
    * @returns A Promise that resolves to a trades response.
    */
    trades(): Promise<Constants.TradeBookResponse>;
    /**
     * Retrieves the funds of the user.
     * @returns A Promise that resolves to a funds response.
     */
    funds(): Promise<Constants.FundsResponse>;
    /**
     * Calculates the margin requirement for a specific order.
     * @param payload OrderMarginRequest
     * @returns A Promise that resolves to a margin response.
     */
    get_order_margin(payload: Constants.OrderMarginRequest): Promise<Constants.OrderMarginResponse>;
    /**
     * Calculates the margin requirement for a specific order.
     * @param payload OrderMarginRequest
     * @returns A Promise that resolves to a margin response.
     */
    get_basket_margin(payload: Constants.BasketMarginRequest): Promise<Constants.BasketMarginResponse>;
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
    /**
     * Retieves the user's saved order tags
     * @returns A Promise that resolves to tags response.
     * */
    get_tags(): Promise<Constants.TagsResponse>;
    /**
     * Modifies an existing tag with the specified parameters.
     * @param payload TagRequest
     * @returns A Promise that resolves to a tag response.
     */
    modify_tag(tag_id: number, payload: Constants.TagModificationRequest): Promise<Constants.TagResponse>;
    /**
    * Deletes an existing tag.
    * @param payload TagRequest
    * @returns A Promise that resolves to a tag response.
    */
    delete_tag(tag_id: number, payload: Constants.TagModificationRequest): Promise<Constants.TagResponse>;
    withdraw_funds(payload: Constants.FundWithdrawalRequest): Promise<Constants.FundWithdrawalResponse>;
    list_withdrawals(): Promise<Constants.FundWithdrawalResponse>;
    cancel_withdrawal(payload: Constants.CancelFundWithdrawalRequest): Promise<Constants.CancelFundWithdrawalResponse>;
    option_chain(payload: Constants.OptionChainRequest): Promise<Constants.OptionChainResponse>;
    download_master(): Promise<Record<string, string>[]>;
}

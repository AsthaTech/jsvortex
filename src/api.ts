"use strict";

import axios, { Method } from 'axios';
import * as Constants from "./types";
import * as csvParse from 'csv-parse';
/**
 * VortexAPI is a class that provides methods to interact with the Vortex REST API.
 */
export class VortexAPI {
    private api_key: string;
    private application_id: string;
    public base_url: string;
    private access_token: string | null;
    private enable_logging: boolean;

    /**
     * Creates an instance of the VortexAPI class.
     * @param api_key The API key for authentication.
     * @param application_id The application ID for the API.
     * @param base_url The base URL of the Vortex API (default: "https://vortex.restapi.asthatrade.com").
     * @param enable_logging Determines whether logging is enabled (default: false).
     */
    constructor(api_key: string, application_id: string, base_url: string = "https://vortex.restapi.asthatrade.com", enable_logging: boolean = false) {
        this.api_key = api_key;
        this.application_id = application_id;
        this.base_url = base_url;
        this.access_token = null;
        this.enable_logging = enable_logging;
        if (this.enable_logging) {
            console.log(`Logging is enabled.`);
        }
    }

    private async _make_api_request<T>(method: Method, endpoint: string, data: object | null = null, params: object | null = null): Promise<T> {
        const bearer_token: string = `Bearer ${this.access_token}`;
        const headers: object = {
            "Content-Type": "application/json",
            "Authorization": bearer_token,
        };
        const url: string = this.base_url + endpoint;
        if (this.enable_logging) {
            console.log(`Making network call to ${url}, params: ${JSON.stringify(params)}, data: ${JSON.stringify(data)}, headers: ${JSON.stringify(headers)}`);
        }
        if (params) {
            var params2 = new URLSearchParams();
            var keys = Object.keys(params) as Array<keyof typeof params>
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (!Array.isArray(params[key])) {
                    params2.append(key, params[key]);
                } else {
                    for (let j = 0; j < (params[key] as any[]).length; j++) {
                        const element = (params[key] as any[])[j];
                        params2.append(key, element)
                    }
                }
            }
            params = params2
        }

        var config: any = { method, url, headers };
        if (data != null) {
            config.data = data
        }
        if (params != null) {
            config.params = params
        }
        return axios.request<T>(config)
            .then((response) => {
                if (this.enable_logging) {
                    console.log(`Response received from ${url}, body: ${JSON.stringify(response.data)}`);
                }
                return response.data;
            })
            .catch((error) => {
                throw error;
            });
    }

    private async _make_unauth_request<T>(method: Method, endpoint: string, data: object | null = null, params: object | null = null): Promise<T> {
        const headers: object = {
            "Content-Type": "application/json",
            "x-api-key": this.api_key
        };
        const url: string = this.base_url + endpoint;
        if (this.enable_logging) {
            console.log(`Making network call to ${url}, params: ${JSON.stringify(params)}, data: ${JSON.stringify(data)}, headers: ${JSON.stringify(headers)}`);
        }
        return axios.request<T>({
            method,
            url,
            headers,
            data,
            params,
        }).then((response) => {
            if (this.enable_logging) {
                console.log(`Response received from ${url}, body: ${JSON.stringify(response.data)}`);
            }
            return response.data;
        })
            .catch((error) => {
                throw error;
            });
    }

    /**
    * Authenticates the user and returns a login response.
    * @param client_code The client code for authentication.
    * @param password The password for authentication.
    * @param totp The Time-based One-Time Password (TOTP) for authentication.
    * @returns A Promise that resolves to a login response.
    */
    async login(client_code: string, password: string, totp: string): Promise<Constants.LoginResponse> {
        const endpoint: string = "/user/login";
        const data: object = {
            client_code: client_code,
            password: password,
            totp: totp,
            application_id: this.application_id,
        };
        return this._make_unauth_request<Constants.LoginResponse>("POST", endpoint, data)
            .then((res) => {
                this._setup_client_code(res)
                // Call _setup_client_code method here if needed
                return res;
            });
    }

    private _setup_client_code(login_object: Constants.LoginResponse): boolean {
        if (
            'data' in login_object &&
            login_object['data'] !== null &&
            login_object['data']['access_token'] !== null
        ) {
            this.access_token = login_object['data']['access_token'];
            return true;
        }

        return false;
    }

    set_access_token(accessToken: string) {
        this.access_token = accessToken
    }

    /**
    * @param payload PlaceOrderRequest
    * @returns A Promise that resolves to an order response.
    */
    async place_order(payload: Constants.PlaceOrderRequest): Promise<Constants.OrderResponse> {
        switch (payload.validity) {
            case Constants.ValidityTypes.FULL_DAY:
                payload.validity_days = 1;
                payload.is_amo = false;
                break;
            case Constants.ValidityTypes.IMMEDIATE_OR_CANCEL:
                payload.is_amo = false;
                payload.validity_days = 0;
                break;
            default:
                payload.validity_days = 1;
                payload.is_amo = true;
                break;
        }
        return this._make_api_request<Constants.OrderResponse>("POST", constructUrl(Constants.URIPlaceOrder, "regular"), payload);
    }

    /**
     * @param payload
     * @returns A Promise that resolves to an iceberg order response.
     */
    async place_iceberg_order(payload: Constants.PlaceIcebergOrderRequest): Promise<Constants.PlaceIcebergOrderResponse> {
        return this._make_api_request<Constants.PlaceIcebergOrderResponse>("POST", constructUrl(Constants.URIPlaceOrder, "iceberg"), payload);
    }

    /**
     * @param payload
     * @returns A Promise that resolves to an iceberg order response.
     */
    async place_gtt_order(payload: Constants.PlaceGttOrderRequest): Promise<Constants.OrderResponse> {
        return this._make_api_request<Constants.OrderResponse>("POST", constructUrl(Constants.URIPlaceOrder, "gtt"), payload);
    }

    /**
     * Modifies an existing order with the specified parameters.
     * @param order_id The ID of the order to be modified.
     * @param payload  ModifyOrderRequest
     * @returns A Promise that resolves to an order response.
     */
    async modify_order(order_id: string, payload: Constants.ModifyOrderRequest): Promise<Constants.OrderResponse> {
        return this._make_api_request<Constants.OrderResponse>("PUT", constructUrl(Constants.URIModifyOrder, "regular", order_id), payload);
    }

    /**
     * Modifies an existing iceberg order with the specified parameters.
     * @param iceberg_order_id The ID of the order to be modified.
     * @param payload  ModifyIcebergOrderRequest
     * @returns A Promise that resolves to an iceberg order response.
     */
    async modify_iceberg_order(iceberg_order_id: string, payload: Constants.ModifyIcebergOrderRequest): Promise<Constants.IcebergOrderResponse> {
        return this._make_api_request<Constants.IcebergOrderResponse>("PUT", constructUrl(Constants.URIModifyOrder, "iceberg", iceberg_order_id), payload);
    }

    /**
    * Modifies an existing gtt order with the specified parameters.
    * @param gtt_order_id The ID of the order to be modified.
    * @param payload  ModifyIcebergOrderRequest
    * @returns A Promise that resolves to an iceberg order response.
    */
    async modify_gtt_order(gtt_order_id: string, payload: Constants.ModifyGttRequest): Promise<Constants.GttOrderModificationResponse> {
        return this._make_api_request<Constants.GttOrderModificationResponse>("PUT", constructUrl(Constants.URIModifyOrder, "gtt", gtt_order_id), payload);
    }

    /**
    * Updates tags of an already placed order.
    * @param order_id The ID of the order to be modified.
    * @param tag_ids List of tag ids to add to any order
    */
    async modify_regular_order_tags(order_id: string, tag_ids: number[]): Promise<Constants.ModifyOrderTagsResponse> {
        return this._make_api_request<Constants.ModifyOrderTagsResponse>("PUT", constructUrl(Constants.URIModifyOrderTags, "regular", order_id), { tag_ids: tag_ids });
    }

    /**
    * Updates tags of an already placed order.
    * @param gtt_order_id The ID of the order to be modified.
    * @param tag_ids List of tag ids to add to any order
    */
    async modify_gtt_order_tags(gtt_order_id: string, tag_ids: number[]): Promise<Constants.ModifyOrderTagsResponse> {
        return this._make_api_request<Constants.ModifyOrderTagsResponse>("PUT", constructUrl(Constants.URIModifyOrderTags, "gtt", gtt_order_id), { tag_ids: tag_ids });
    }

    /**
    * Cancels an order with the specified order ID.
    * @param order_id The ID of the order to be canceled.
    * @returns A Promise that resolves to an order response.
    */
    async cancel_order(order_id: string): Promise<Constants.OrderResponse> {
        return this._make_api_request<Constants.OrderResponse>("DELETE", constructUrl(Constants.URIModifyOrder, "regular", order_id), null);
    }

    /**
    * Cancels multiple orders with the specified order IDs.
    * @param order_ids The IDs of the order to be canceled.
    * @returns A Promise that resolves to MultipleOrderCancelResponse.
    */
    async cancel_multiple_orders(order_ids: string[]): Promise<Constants.MultipleOrderCancelResponse> {
        return this._make_api_request<Constants.MultipleOrderCancelResponse>("POST", constructUrl(Constants.URIMultiCancelrders, "regular"), { order_ids: order_ids });
    }

    /**
    * Cancels iceberg order with the specified order IDs.
    * @param iceberg_order_id The ID of the iceberg order to be canceled.
    * @returns A Promise that resolves to IcebergOrderResponse.
    */
    async cancel_iceberg_order(iceberg_order_id: string): Promise<Constants.IcebergOrderResponse> {
        return this._make_api_request<Constants.IcebergOrderResponse>("DELETE", constructUrl(Constants.URIModifyOrder, "iceberg", iceberg_order_id), null);
    }

    /**
    * Cancels gtt order with the specified order IDs.
    * @param gtt_order_id The ID of the gtt order to be canceled.
    * @returns A Promise that resolves to GttOrderModificationResponse.
    */
    async cancel_gtt_order(gtt_order_id: string): Promise<Constants.GttOrderModificationResponse> {
        return this._make_api_request<Constants.GttOrderModificationResponse>("DELETE", constructUrl(Constants.URIModifyOrder, "gtt", gtt_order_id), null);
    }

    /**
    * Retrieves the order book.
    * @returns A Promise that resolves to an order book response.
    */
    async orders(): Promise<Constants.OrderBookResponse> {
        return this._make_api_request<Constants.OrderBookResponse>("GET", Constants.URIOrderBook);
    }

    /**
    * Retrieves the GTT order book.
    * @returns A Promise that resolves to a GTT order book response.
    */
    async gtt_orders(): Promise<Constants.GttOrderbookResponse> {
        return this._make_api_request<Constants.GttOrderbookResponse>("GET", Constants.URIGttOrderBook);
    }

    /**
     * Retrieves the order history for a specific order.
     * @param order_id The ID of the order to retrieve the history for.
     */
    async order_history(order_id: string): Promise<Constants.OrderHistoryResponse> {
        return this._make_api_request<Constants.OrderHistoryResponse>("GET", constructUrl(Constants.URIOrderHistory, order_id));
    }

    /**
    * Retrieves the positions of the user.
    * @returns A Promise that resolves to a position response.
    */
    async positions(): Promise<Constants.PositionResponse> {
        return this._make_api_request<Constants.PositionResponse>("GET", Constants.URIPositions);
    }

    /**
    * Converts position's product type .
    * @returns A Promise that resolves to a convert position's response.
    */
    async convert_position(payload: Constants.ConvertPositionRequest): Promise<Constants.ConvertPositionResponse> {
        return this._make_api_request<Constants.ConvertPositionResponse>("PUT", Constants.URIConvertposition, payload, null);
    }

    /**
    * Retrieves the holdings of the user.
    * @returns A Promise that resolves to a holdings response.
    */
    async holdings(): Promise<Constants.HoldingsResponse> {
        return this._make_api_request<Constants.HoldingsResponse>("GET", Constants.URIHoldings);
    }

    /**
    * Retrieves the todays's trades of the user.
    * @returns A Promise that resolves to a trades response.
    */
    async trades(): Promise<Constants.TradeBookResponse> {
        return this._make_api_request<Constants.TradeBookResponse>("GET", Constants.URITrades, null,null);
    }

    /**
     * Retrieves the funds of the user.
     * @returns A Promise that resolves to a funds response.
     */
    async funds(): Promise<Constants.FundsResponse> {
        return this._make_api_request<Constants.FundsResponse>("GET", Constants.URIFunds);
    }

    /**
     * Calculates the margin requirement for a specific order.
     * @param payload OrderMarginRequest
     * @returns A Promise that resolves to a margin response.
     */
    async get_order_margin(payload: Constants.OrderMarginRequest): Promise<Constants.OrderMarginResponse> {
        return this._make_api_request<Constants.OrderMarginResponse>("POST", Constants.URIOrderMargin, payload);
    }

    /**
     * Calculates the margin requirement for a specific order.
     * @param payload OrderMarginRequest
     * @returns A Promise that resolves to a margin response.
     */
    async get_basket_margin(payload: Constants.BasketMarginRequest): Promise<Constants.BasketMarginResponse> {
        return this._make_api_request<Constants.BasketMarginResponse>("POST", Constants.URIBasketMargin, payload);
    }

    /**
     * Retrieves quotes for the specified instruments.
     * @param instruments The list of instruments to retrieve quotes for.
     * @param mode The quote mode for the request.
     * @returns A Promise that resolves to a quote response.
     */
    async quotes(instruments: string[], mode: Constants.QuoteModes): Promise<Constants.QuoteResponse> {
        const params = { "q": instruments, "mode": mode }
        return this._make_api_request<Constants.QuoteResponse>("GET", Constants.URIQuotes, null, params);
    }

    /**
    * Retrieves historical candle data for the specified parameters.
    * @param exchange The exchange type for the historical data.
    * @param token The token value for the historical data.
    * @param to The end date/time of the historical data range.
    * @param start The start date/time of the historical data range.
    * @param resolution The resolution of the historical data.
    * @returns A Promise that resolves to a historical response.
    */
    async historical_candles(exchange: Constants.ExchangeTypes, token: number, to: Date, start: Date, resolution: Constants.Resolutions): Promise<Constants.HistoricalResponse> {
        const params = { "exchange": exchange, "token": token, "to": Math.floor(to.getTime() / 1000), "from": Math.floor(start.getTime() / 1000), "resolution": resolution }
        return this._make_api_request<Constants.HistoricalResponse>("GET", Constants.URIHistory, null, params);
    }

    async download_master(): Promise<Record<string, string>[]> {
        const endpoint = '/data/instruments';
        const bearer_token = `Bearer ${this.access_token}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: bearer_token,
        };

        try {
            const response = await axios.get(this.base_url + endpoint, { headers });
            const decoded_content = response.data;
            const results: Record<string, string>[] = [];
            await new Promise<void>((resolve, reject) => {
                csvParse.parse(decoded_content, {
                    columns: true,
                })
                    .on('data', (row) => {
                        results.push(row);
                    })
                    .on('error', (error) => {
                        reject(error);
                    })
                    .on('end', () => {
                        resolve();
                    });
            });

            return results;
        } catch (e) {
            throw new Error(e as string);
        }
    }

}

function constructUrl(templateUrl: string, ...params: string[]): string {
    return params.reduce((acc, param) => acc.replace('%s', param), templateUrl);
}
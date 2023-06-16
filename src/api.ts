"use strict";

import axios, { Method } from 'axios';
import * as Constants from "./types";

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
        if(params){
            var params2 = new URLSearchParams();
            var keys = Object.keys(params) as Array<keyof typeof params>
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i]; 
                if(!Array.isArray(params[key])){
                    params2.append(key, params[key]);
                }else{
                    for (let j = 0; j < (params[key] as any[]).length; j++) {
                        const element = (params[key] as any[])[j];
                        params2.append(key,element)
                    }
                }
            }
            params = params2
        }
        return axios.request<T>({
            method,
            url,
            headers,
            data,
            params,
        })
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
    async placeOrder(
        exchange: Constants.ExchangeTypes,
        token: number,
        transaction_type: Constants.TransactionTypes,
        product: Constants.ProductTypes,
        variety: Constants.VarietyTypes,
        quantity: number,
        price: number,
        trigger_price: number,
        disclosed_quantity: number,
        validity: Constants.ValidityTypes
    ): Promise<Constants.OrderResponse> {
        const endpoint = "/orders/regular";

        let validity_days: number;
        let is_amo: boolean;

        if (validity === Constants.ValidityTypes.FULL_DAY) {
            validity_days = 1;
            is_amo = false;
        } else if (validity === Constants.ValidityTypes.IMMEDIATE_OR_CANCEL) {
            validity_days = 0;
            is_amo = false;
        } else {
            validity_days = 1;
            is_amo = true;
        }

        const data = {
            exchange,
            token,
            transaction_type,
            product,
            variety,
            quantity,
            price,
            trigger_price,
            disclosed_quantity,
            validity,
            validity_days,
            is_amo,
        };

        return this._make_api_request<Constants.OrderResponse>("POST", endpoint, data);
    }

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
    async modifyOrder(
        exchange: Constants.ExchangeTypes,
        order_id: string,
        variety: Constants.VarietyTypes,
        quantity: number,
        traded_quantity: number,
        price: number,
        trigger_price: number,
        disclosed_quantity: number,
        validity: Constants.ValidityTypes
    ): Promise<Constants.OrderResponse> {
        const endpoint = `/orders/regular/${exchange}/${order_id}`;

        let validity_days: number;

        if (validity === Constants.ValidityTypes.FULL_DAY) {
            validity_days = 1;
        } else if (validity === Constants.ValidityTypes.IMMEDIATE_OR_CANCEL) {
            validity_days = 0;
        } else {
            validity_days = 1;
        }

        const data = {
            variety,
            quantity,
            traded_quantity,
            price,
            trigger_price,
            disclosed_quantity,
            validity,
            validity_days,
        };

        return this._make_api_request<Constants.OrderResponse>("PUT", endpoint, data);
    }

    /**
    * Cancels an order with the specified exchange and order ID.
    * @param exchange The exchange type of the order.
    * @param order_id The ID of the order to be canceled.
    * @returns A Promise that resolves to an order response.
    */
    async cancel_order(exchange: Constants.ExchangeTypes, order_id: string): Promise<Constants.OrderResponse> {
        const endpoint = `/orders/regular/${exchange}/${order_id}`;
        return this._make_api_request<Constants.OrderResponse>("DELETE", endpoint);
    }

    /**
    * Retrieves the order book with the specified limit and offset.
    * @param limit The maximum number of orders to retrieve.
    * @param offset The offset value for pagination.
    * @returns A Promise that resolves to an order book response.
    */
    async orders(limit: number, offset: number): Promise<Constants.OrderBookResponse> {
        const endpoint = `/orders?limit=${limit}&offset=${offset}`
        return this._make_api_request<Constants.OrderBookResponse>("GET", endpoint);
    }

    /**
     * Retrieves the order history for a specific order.
     * @param order_id The ID of the order to retrieve the history for.
     */

    async order_history(order_id: string) {

    }

    /**
    * Retrieves the positions of the user.
    * @returns A Promise that resolves to a position response.
    */
    async positions(): Promise<Constants.PositionResponse> {
        const endpoint = "/portfolio/positions"
        return this._make_api_request<Constants.PositionResponse>("GET", endpoint);
    }
    /**
    * Retrieves the holdings of the user.
    * @returns A Promise that resolves to a holdings response.
    */

    async holdings(): Promise<Constants.HoldingsResponse> {
        const endpoint = "/portfolio/holdings"
        return this._make_api_request<Constants.HoldingsResponse>("GET", endpoint);
    }

    /**
     * Retrieves the funds of the user.
     * @returns A Promise that resolves to a funds response.
     */

    async funds(): Promise<Constants.FundsResponse> {
        const endpoint = "/user/funds"
        return this._make_api_request<Constants.FundsResponse>("GET", endpoint);
    }

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
    async get_order_margin(exchange: Constants.ExchangeTypes, token: number, transaction_type: Constants.TransactionTypes, product: Constants.ProductTypes, variety: Constants.VarietyTypes, quantity: number, price: number, mode: Constants.OrderMarginModes, old_quantity: number = 0, old_price: number = 0): Promise<Constants.MarginResponse> {
        const data = {
            exchange,
            token,
            transaction_type,
            product,
            variety,
            quantity,
            price,
            old_price,
            old_quantity,
            mode
        };

        const endpoint = "/margins/order"
        return this._make_api_request<Constants.MarginResponse>("POST", endpoint, data);
    }

    /**
     * Retrieves quotes for the specified instruments.
     * @param instruments The list of instruments to retrieve quotes for.
     * @param mode The quote mode for the request.
     * @returns A Promise that resolves to a quote response.
     */
    async quotes(instruments: string[], mode: Constants.QuoteModes): Promise<Constants.QuoteResponse> {
        const endpoint = "/data/quote"
        const params = { "q": instruments, "mode": mode }
        return this._make_api_request<Constants.QuoteResponse>("GET", endpoint, null, params);
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
        const endpoint = "/data/history"
        const params = { "exchange": exchange, "token": token, "to": Math.floor(to.getTime() / 1000), "from": Math.floor(start.getTime() / 1000), "resolution": resolution }
        return this._make_api_request<Constants.HistoricalResponse>("GET", endpoint, null, params);
    }
}

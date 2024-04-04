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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VortexAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const Constants = __importStar(require("./types"));
const csvParse = __importStar(require("csv-parse"));
/**
 * VortexAPI is a class that provides methods to interact with the Vortex REST API.
 */
class VortexAPI {
    /**
     * Creates an instance of the VortexAPI class.
     * @param api_key The API key for authentication.
     * @param application_id The application ID for the API.
     * @param base_url The base URL of the Vortex API (default: "https://vortex.restapi.asthatrade.com").
     * @param enable_logging Determines whether logging is enabled (default: false).
     */
    constructor(api_key, application_id, base_url = "https://vortex-api.rupeezy.in/v2", enable_logging = false) {
        this.api_key = api_key;
        this.application_id = application_id;
        this.base_url = base_url;
        this.access_token = null;
        this.enable_logging = enable_logging;
        if (this.enable_logging) {
            console.log(`Logging is enabled.`);
        }
    }
    _make_api_request(method, endpoint, data = null, params = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const bearer_token = `Bearer ${this.access_token}`;
            const headers = {
                "Content-Type": "application/json",
                "Authorization": bearer_token,
            };
            const url = this.base_url + endpoint;
            if (this.enable_logging) {
                console.log(`Making network call to ${url}, params: ${JSON.stringify(params)}, data: ${JSON.stringify(data)}, headers: ${JSON.stringify(headers)}`);
            }
            if (params) {
                var params2 = new URLSearchParams();
                var keys = Object.keys(params);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (!Array.isArray(params[key])) {
                        params2.append(key, params[key]);
                    }
                    else {
                        for (let j = 0; j < params[key].length; j++) {
                            const element = params[key][j];
                            params2.append(key, element);
                        }
                    }
                }
                params = params2;
            }
            var config = { method, url, headers };
            if (data != null) {
                config.data = data;
            }
            if (params != null) {
                config.params = params;
            }
            return axios_1.default.request(config)
                .then((response) => {
                if (this.enable_logging) {
                    console.log(`Response received from ${url}, body: ${JSON.stringify(response.data)}`);
                }
                return response.data;
            })
                .catch((error) => {
                throw error;
            });
        });
    }
    _make_unauth_request(method, endpoint, data = null, params = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                "Content-Type": "application/json",
                "x-api-key": this.api_key
            };
            const url = this.base_url + endpoint;
            if (this.enable_logging) {
                console.log(`Making network call to ${url}, params: ${JSON.stringify(params)}, data: ${JSON.stringify(data)}, headers: ${JSON.stringify(headers)}`);
            }
            return axios_1.default.request({
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
        });
    }
    /**
    * Authenticates the user and returns a login response.
    * @param client_code The client code for authentication.
    * @param password The password for authentication.
    * @param totp The Time-based One-Time Password (TOTP) for authentication.
    * @returns A Promise that resolves to a login response.
    */
    login(client_code, password, totp) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                client_code: client_code,
                password: password,
                totp: totp,
                application_id: this.application_id,
            };
            return this._make_unauth_request("POST", Constants.URILogin, data)
                .then((res) => {
                this._setup_client_code(res);
                // Call _setup_client_code method here if needed
                return res;
            });
        });
    }
    _setup_client_code(login_object) {
        if ('data' in login_object &&
            login_object['data'] !== null &&
            login_object['data']['access_token'] !== null) {
            this.access_token = login_object['data']['access_token'];
            return true;
        }
        return false;
    }
    set_access_token(accessToken) {
        this.access_token = accessToken;
    }
    /**
    * @param payload PlaceOrderRequest
    * @returns A Promise that resolves to an order response.
    */
    place_order(payload) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return this._make_api_request("POST", constructUrl(Constants.URIPlaceOrder, "regular"), payload);
        });
    }
    /**
     * @param payload
     * @returns A Promise that resolves to an iceberg order response.
     */
    place_iceberg_order(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("POST", constructUrl(Constants.URIPlaceOrder, "iceberg"), payload);
        });
    }
    /**
     * @param payload
     * @returns A Promise that resolves to an iceberg order response.
     */
    place_gtt_order(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("POST", constructUrl(Constants.URIPlaceOrder, "gtt"), payload);
        });
    }
    /**
     * Modifies an existing order with the specified parameters.
     * @param order_id The ID of the order to be modified.
     * @param payload  ModifyOrderRequest
     * @returns A Promise that resolves to an order response.
     */
    modify_order(order_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("PUT", constructUrl(Constants.URIModifyOrder, "regular", order_id), payload);
        });
    }
    /**
     * Modifies an existing iceberg order with the specified parameters.
     * @param iceberg_order_id The ID of the order to be modified.
     * @param payload  ModifyIcebergOrderRequest
     * @returns A Promise that resolves to an iceberg order response.
     */
    modify_iceberg_order(iceberg_order_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("PUT", constructUrl(Constants.URIModifyOrder, "iceberg", iceberg_order_id), payload);
        });
    }
    /**
    * Modifies an existing gtt order with the specified parameters.
    * @param gtt_order_id The ID of the order to be modified.
    * @param payload  ModifyIcebergOrderRequest
    * @returns A Promise that resolves to an iceberg order response.
    */
    modify_gtt_order(gtt_order_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("PUT", constructUrl(Constants.URIModifyOrder, "gtt", gtt_order_id), payload);
        });
    }
    /**
    * Updates tags of an already placed order.
    * @param order_id The ID of the order to be modified.
    * @param tag_ids List of tag ids to add to any order
    */
    modify_regular_order_tags(order_id, tag_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("PUT", constructUrl(Constants.URIModifyOrderTags, "regular", order_id), { tag_ids: tag_ids });
        });
    }
    /**
    * Updates tags of an already placed order.
    * @param gtt_order_id The ID of the order to be modified.
    * @param tag_ids List of tag ids to add to any order
    */
    modify_gtt_order_tags(gtt_order_id, tag_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("PUT", constructUrl(Constants.URIModifyOrderTags, "gtt", gtt_order_id), { tag_ids: tag_ids });
        });
    }
    /**
    * Cancels an order with the specified order ID.
    * @param order_id The ID of the order to be canceled.
    * @returns A Promise that resolves to an order response.
    */
    cancel_order(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("DELETE", constructUrl(Constants.URIModifyOrder, "regular", order_id), null);
        });
    }
    /**
    * Cancels multiple orders with the specified order IDs.
    * @param order_ids The IDs of the order to be canceled.
    * @returns A Promise that resolves to MultipleOrderCancelResponse.
    */
    cancel_multiple_orders(order_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("POST", constructUrl(Constants.URIMultiCancelrders, "regular"), { order_ids: order_ids });
        });
    }
    /**
    * Cancels iceberg order with the specified order IDs.
    * @param iceberg_order_id The ID of the iceberg order to be canceled.
    * @returns A Promise that resolves to IcebergOrderResponse.
    */
    cancel_iceberg_order(iceberg_order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("DELETE", constructUrl(Constants.URIModifyOrder, "iceberg", iceberg_order_id), null);
        });
    }
    /**
    * Cancels gtt order with the specified order IDs.
    * @param gtt_order_id The ID of the gtt order to be canceled.
    * @returns A Promise that resolves to GttOrderModificationResponse.
    */
    cancel_gtt_order(gtt_order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("DELETE", constructUrl(Constants.URIModifyOrder, "gtt", gtt_order_id), null);
        });
    }
    /**
    * Retrieves the order book.
    * @returns A Promise that resolves to an order book response.
    */
    orders() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("GET", Constants.URIOrderBook);
        });
    }
    /**
    * Retrieves the GTT order book.
    * @returns A Promise that resolves to a GTT order book response.
    */
    gtt_orders() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("GET", Constants.URIGttOrderBook);
        });
    }
    /**
     * Retrieves the order history for a specific order.
     * @param order_id The ID of the order to retrieve the history for.
     */
    order_history(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("GET", constructUrl(Constants.URIOrderHistory, order_id));
        });
    }
    /**
    * Retrieves the positions of the user.
    * @returns A Promise that resolves to a position response.
    */
    positions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("GET", Constants.URIPositions);
        });
    }
    /**
    * Converts position's product type .
    * @returns A Promise that resolves to a convert position's response.
    */
    convert_position(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("PUT", Constants.URIConvertposition, payload, null);
        });
    }
    /**
    * Retrieves the holdings of the user.
    * @returns A Promise that resolves to a holdings response.
    */
    holdings() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("GET", Constants.URIHoldings);
        });
    }
    /**
    * Retrieves the todays's trades of the user.
    * @returns A Promise that resolves to a trades response.
    */
    trades() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("GET", Constants.URITrades, null, null);
        });
    }
    /**
     * Retrieves the funds of the user.
     * @returns A Promise that resolves to a funds response.
     */
    funds() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("GET", Constants.URIFunds);
        });
    }
    /**
     * Calculates the margin requirement for a specific order.
     * @param payload OrderMarginRequest
     * @returns A Promise that resolves to a margin response.
     */
    get_order_margin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("POST", Constants.URIOrderMargin, payload);
        });
    }
    /**
     * Calculates the margin requirement for a specific order.
     * @param payload OrderMarginRequest
     * @returns A Promise that resolves to a margin response.
     */
    get_basket_margin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("POST", Constants.URIBasketMargin, payload);
        });
    }
    /**
     * Retrieves quotes for the specified instruments.
     * @param instruments The list of instruments to retrieve quotes for.
     * @param mode The quote mode for the request.
     * @returns A Promise that resolves to a quote response.
     */
    quotes(instruments, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { "q": instruments, "mode": mode };
            return this._make_api_request("GET", Constants.URIQuotes, null, params);
        });
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
    historical_candles(exchange, token, to, start, resolution) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { "exchange": exchange, "token": token, "to": Math.floor(to.getTime() / 1000), "from": Math.floor(start.getTime() / 1000), "resolution": resolution };
            return this._make_api_request("GET", Constants.URIHistory, null, params);
        });
    }
    /**
     * Retieves the user's saved order tags
     * @returns A Promise that resolves to tags response.
     * */
    get_tags() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("GET", Constants.URITags);
        });
    }
    /**
     * Modifies an existing tag with the specified parameters.
     * @param payload TagRequest
     * @returns A Promise that resolves to a tag response.
     */
    modify_tag(tag_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("PUT", constructUrl(Constants.URITag, tag_id.toString()));
        });
    }
    /**
    * Deletes an existing tag.
    * @param payload TagRequest
    * @returns A Promise that resolves to a tag response.
    */
    delete_tag(tag_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("PUT", constructUrl(Constants.URITag, tag_id.toString()));
        });
    }
    withdraw_funds(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("POST", Constants.URIWithdrawal, payload);
        });
    }
    list_withdrawals() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("GET", Constants.URIWithdrawal);
        });
    }
    cancel_withdrawal(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("PUT", Constants.URIWithdrawal, payload);
        });
    }
    option_chain(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._make_api_request("POST", Constants.URIOptionChain, payload);
        });
    }
    download_master() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = '/data/instruments';
            const bearer_token = `Bearer ${this.access_token}`;
            const headers = {
                'Content-Type': 'application/json',
                Authorization: bearer_token,
            };
            try {
                const response = yield axios_1.default.get(this.base_url + endpoint, { headers });
                const decoded_content = response.data;
                const results = [];
                yield new Promise((resolve, reject) => {
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
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
}
exports.VortexAPI = VortexAPI;
function constructUrl(templateUrl, ...params) {
    return params.reduce((acc, param) => acc.replace('%s', param), templateUrl);
}

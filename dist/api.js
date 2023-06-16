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
    constructor(api_key, application_id, base_url = "https://vortex.restapi.asthatrade.com", enable_logging = false) {
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
            return axios_1.default.request({
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
            const endpoint = "/user/login";
            const data = {
                client_code: client_code,
                password: password,
                totp: totp,
                application_id: this.application_id,
            };
            return this._make_unauth_request("POST", endpoint, data)
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
    placeOrder(exchange, token, transaction_type, product, variety, quantity, price, trigger_price, disclosed_quantity, validity) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = "/orders/regular";
            let validity_days;
            let is_amo;
            if (validity === Constants.ValidityTypes.FULL_DAY) {
                validity_days = 1;
                is_amo = false;
            }
            else if (validity === Constants.ValidityTypes.IMMEDIATE_OR_CANCEL) {
                validity_days = 0;
                is_amo = false;
            }
            else {
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
            return this._make_api_request("POST", endpoint, data);
        });
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
    modifyOrder(exchange, order_id, variety, quantity, traded_quantity, price, trigger_price, disclosed_quantity, validity) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = `/orders/regular/${exchange}/${order_id}`;
            let validity_days;
            if (validity === Constants.ValidityTypes.FULL_DAY) {
                validity_days = 1;
            }
            else if (validity === Constants.ValidityTypes.IMMEDIATE_OR_CANCEL) {
                validity_days = 0;
            }
            else {
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
            return this._make_api_request("PUT", endpoint, data);
        });
    }
    /**
    * Cancels an order with the specified exchange and order ID.
    * @param exchange The exchange type of the order.
    * @param order_id The ID of the order to be canceled.
    * @returns A Promise that resolves to an order response.
    */
    cancel_order(exchange, order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = `/orders/regular/${exchange}/${order_id}`;
            return this._make_api_request("DELETE", endpoint);
        });
    }
    /**
    * Retrieves the order book with the specified limit and offset.
    * @param limit The maximum number of orders to retrieve.
    * @param offset The offset value for pagination.
    * @returns A Promise that resolves to an order book response.
    */
    orders(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = `/orders?limit=${limit}&offset=${offset}`;
            return this._make_api_request("GET", endpoint);
        });
    }
    /**
     * Retrieves the order history for a specific order.
     * @param order_id The ID of the order to retrieve the history for.
     */
    order_history(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
    * Retrieves the positions of the user.
    * @returns A Promise that resolves to a position response.
    */
    positions() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = "/portfolio/positions";
            return this._make_api_request("GET", endpoint);
        });
    }
    /**
    * Retrieves the holdings of the user.
    * @returns A Promise that resolves to a holdings response.
    */
    holdings() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = "/portfolio/holdings";
            return this._make_api_request("GET", endpoint);
        });
    }
    /**
     * Retrieves the funds of the user.
     * @returns A Promise that resolves to a funds response.
     */
    funds() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = "/user/funds";
            return this._make_api_request("GET", endpoint);
        });
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
    get_order_margin(exchange, token, transaction_type, product, variety, quantity, price, mode, old_quantity = 0, old_price = 0) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const endpoint = "/margins/order";
            return this._make_api_request("POST", endpoint, data);
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
            const endpoint = "/data/quote";
            const params = { "q": instruments, "mode": mode };
            return this._make_api_request("GET", endpoint, null, params);
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
            const endpoint = "/data/history";
            const params = { "exchange": exchange, "token": token, "to": Math.floor(to.getTime() / 1000), "from": Math.floor(start.getTime() / 1000), "resolution": resolution };
            return this._make_api_request("GET", endpoint, null, params);
        });
    }
    downloadMaster() {
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

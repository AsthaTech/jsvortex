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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VortexFeed = void 0;
const WebSocket = __importStar(require("ws"));
class VortexFeed {
    constructor(access_token, enable_logging, auto_reconnect = false, reconnectInterval = 3000, reconnectAttempts = Infinity, url = "wss://wire.asthatrade.com/ws") {
        this.connection = null;
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectAttempts = reconnectAttempts;
        this.currentReconnectAttempts = 0;
        this.access_token = access_token;
        this.auto_reconnect = auto_reconnect;
        this.triggers = {
            "connect": [],
            "price_update": [],
            "disconnect": [],
            "error": [],
            "close": [],
            "reconnect": [],
            "noreconnect": [],
            "message": [],
            "order_update": []
        };
        this.subscriptions = {};
    }
    connect() {
        if (this.connection && (this.connection.readyState == WebSocket.CONNECTING || this.connection.readyState == WebSocket.OPEN))
            return;
        // const url = this.url + "?auth_token=" + this.access_token + "&uid=" + (new Date().getTime().toString())
        const url = this.url + "?auth_token=" + this.access_token;
        this.connection = new WebSocket.WebSocket(url);
        this.connection.binaryType = "arraybuffer";
        this.connection.onopen = () => {
            this.currentReconnectAttempts = 0;
            this.trigger("connect");
        };
        this.connection.onerror = (e) => {
            this.trigger("error", [e]);
            // Force close to avoid ghost connections
            if (this.connection && this.connection.readyState == this.connection.OPEN)
                this.connection.close();
        };
        this.connection.onclose = (e) => {
            this.trigger("close", [e]);
            if (this.auto_reconnect)
                this.tryReconnect();
        };
        this.connection.onmessage = (e) => {
            if (e.data instanceof ArrayBuffer) {
                this.trigger("message", [e.data]);
                if (e.data.byteLength > 2) {
                    const d = this.parseBinary(e.data);
                    if (d)
                        this.trigger("price_update", [d]);
                }
            }
            else {
                this.trigger("order_update", [e.data]);
            }
        };
    }
    on(trigger_type, callback) {
        if (this.triggers.hasOwnProperty(trigger_type)) {
            this.triggers[trigger_type].push(callback);
        }
    }
    trigger(e, args) {
        if (!this.triggers[e])
            return;
        for (let n = 0; n < this.triggers[e].length; n++) {
            this.triggers[e][n].apply(this.triggers[e][n], args ? args : []);
        }
    }
    connected() {
        if (this.connection && this.connection.readyState == WebSocket.OPEN) {
            return true;
        }
        else {
            return false;
        }
    }
    disconnect() {
        if (this.connection && this.connection.readyState != this.connection.CLOSING && this.connection.readyState != this.connection.CLOSED) {
            this.trigger("disconnect");
            this.connection.close();
        }
    }
    subscribe(exchange, token, mode) {
        const message = { "message_type": "subscribe", exchange, token, mode };
        if (!this.subscriptions[exchange])
            this.subscriptions[exchange] = [];
        this.subscriptions[exchange][token] = mode;
        this.send(message);
    }
    unsubscribe(exchange, token) {
        const message = { "message_type": "unsubscribe", exchange, token };
        if (this.subscriptions[exchange] && this.subscriptions[token])
            delete this.subscriptions[exchange][token];
        if (this.subscriptions[exchange].length == 0)
            delete this.subscriptions[exchange];
        this.send(message);
    }
    send(message) {
        if (!this.connection || this.connection.readyState != this.connection.OPEN)
            return;
        try {
            if (typeof (message) == "object") {
                message = JSON.stringify(message);
            }
            console.log("sending message", message);
            this.connection.send(message);
        }
        catch (e) {
            this.connection.close();
        }
        ;
    }
    tryReconnect() {
        if (this.currentReconnectAttempts >= this.reconnectAttempts) {
            this.trigger("noreconnect");
            console.log('Exceeded maximum number of reconnect attempts.');
            process.exit(1);
            return;
        }
        this.currentReconnectAttempts++;
        this.trigger("reconnect", [this.currentReconnectAttempts, this.reconnectInterval]);
        setTimeout(() => {
            console.log('Reconnecting...');
            this.connect();
        }, this.reconnectInterval);
    }
    parseBinary(data) {
        const packets = this.splitPackets(data);
        var price_updates = [];
        for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            if (packet.byteLength == 22) {
                var update = this._unpackLtpQuote(packet);
                price_updates.push(update);
            }
            else if (packet.byteLength == 62) {
                var update2 = this._unpackOhlcvQuote(packet);
                price_updates.push(update2);
            }
            else if (packet.byteLength == 266) {
                var update3 = this._unpackFullQuote(packet);
                price_updates.push(update3);
            }
        }
        return price_updates;
    }
    splitPackets(bin) {
        const dataView = new DataView(bin);
        let num = dataView.getInt16(0, true), j = 2, packets = [];
        for (let i = 0; i < num; i++) {
            // first two bytes is the packet length
            const size = dataView.getInt16(j, true);
            var packet = bin.slice(j + 2, j + 2 + size);
            packets.push(packet);
            j += 2 + size;
        }
        return packets;
    }
    _unpackInt(bin, start, end, byteFormat = "H") {
        const dataView = new DataView(bin);
        const bytes = end - start;
        const littleEndian = true;
        if (byteFormat === "H") {
            // Unsigned 16-bit integer
            return dataView.getUint16(start, littleEndian);
        }
        else if (byteFormat === "I") {
            // Unsigned 32-bit integer
            return dataView.getUint32(start, littleEndian);
        }
        else if (byteFormat === "Q") {
            // Unsigned 64-bit integer (not supported by DataView)
            const highBits = dataView.getUint32(start, littleEndian);
            const lowBits = dataView.getUint32(start + 4, littleEndian);
            return Number((BigInt(highBits) << BigInt(32)) + BigInt(lowBits));
        }
        else {
            throw new Error("Unsupported byte format.");
        }
    }
    _unpackString(dataView, offset, length) {
        let str = "";
        for (let i = 0; i < length; i++) {
            const charCode = dataView.getUint8(offset + i);
            str += String.fromCharCode(charCode);
        }
        return str;
    }
    _unpackLtpQuote(bin) {
        const dataView = new DataView(bin);
        var quote = {};
        let offset = 0;
        quote.exchange = this.rstrip(this._unpackString(dataView, offset, 10));
        offset += 10;
        quote.token = dataView.getInt32(offset, true);
        offset += 4;
        quote.last_trade_price = dataView.getFloat64(offset, true);
        return quote;
    }
    _unpackOhlcvQuote(bin) {
        const dataView = new DataView(bin);
        var quote = {};
        let offset = 0;
        quote.exchange = this.rstrip(this._unpackString(dataView, offset, 10));
        offset += 10;
        quote.token = dataView.getInt32(offset, true);
        offset += 4;
        quote.last_trade_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.last_trade_time = dataView.getInt32(offset, true);
        offset += 4;
        quote.open_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.high_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.low_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.close_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.volume = dataView.getInt32(offset, true);
        offset += 4;
        return quote;
    }
    _unpackFullQuote(bin) {
        const dataView = new DataView(bin);
        var quote = {};
        let offset = 0;
        quote.exchange = this.rstrip(this._unpackString(dataView, offset, 10));
        offset += 10;
        quote.token = dataView.getInt32(offset, true);
        offset += 4;
        quote.last_trade_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.last_trade_time = dataView.getInt32(offset, true);
        offset += 4;
        quote.open_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.high_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.low_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.close_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.volume = dataView.getInt32(offset, true);
        offset += 4;
        quote.last_update_time = dataView.getInt32(offset, true);
        offset += 4;
        quote.last_trade_quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.average_trade_price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.total_buy_quantity = dataView.getBigInt64(offset, true);
        offset += 8;
        quote.total_sell_quantity = dataView.getBigInt64(offset, true);
        offset += 8;
        quote.open_interest = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth = { buy: [
                {
                    price: 0.0, quantity: 0, orders: 0
                },
                {
                    price: 0.0, quantity: 0, orders: 0
                },
                {
                    price: 0.0, quantity: 0, orders: 0
                },
                {
                    price: 0.0, quantity: 0, orders: 0
                },
                {
                    price: 0.0, quantity: 0, orders: 0
                },
            ], sell: [
                {
                    price: 0.0, quantity: 0, orders: 0
                },
                {
                    price: 0.0, quantity: 0, orders: 0
                },
                {
                    price: 0.0, quantity: 0, orders: 0
                },
                {
                    price: 0.0, quantity: 0, orders: 0
                },
                {
                    price: 0.0, quantity: 0, orders: 0
                },
            ] };
        quote.depth.buy[0].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.buy[0].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.buy[0].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.buy[1].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.buy[1].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.buy[1].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.buy[2].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.buy[2].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.buy[2].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.buy[3].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.buy[3].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.buy[3].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.buy[4].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.buy[4].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.buy[4].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[0].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.sell[0].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[0].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[1].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.sell[1].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[1].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[2].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.sell[2].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[2].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[3].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.sell[3].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[3].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[4].price = dataView.getFloat64(offset, true);
        offset += 8;
        quote.depth.sell[4].quantity = dataView.getInt32(offset, true);
        offset += 4;
        quote.depth.sell[4].orders = dataView.getInt32(offset, true);
        offset += 4;
        quote.dpr_high = dataView.getInt32(offset, true);
        offset += 4;
        quote.dpr_low = dataView.getInt32(offset, true);
        return quote;
    }
    rstrip(str) {
        const nullChar = '\x00';
        let endIndex = str.length - 1;
        while (endIndex >= 0 && str[endIndex] === nullChar) {
            endIndex--;
        }
        return str.substring(0, endIndex + 1);
    }
}
exports.VortexFeed = VortexFeed;

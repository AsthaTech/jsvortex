import * as Constants from "./types";
import * as WebSocket from 'ws';
export class VortexFeed {
    private connection: WebSocket.WebSocket | null;
    private url: string;
    private access_token: string;
    private reconnectInterval: number;
    private reconnectAttempts: number;
    private currentReconnectAttempts: number;
    private triggers: Record<string, Function[]>;
    private subscriptions: Record<string,Record<number,string>[]>; 
    private auto_reconnect: boolean;
    constructor(access_token: string, enable_logging: boolean, auto_reconnect: boolean = false, reconnectInterval: number = 3000, reconnectAttempts: number = Infinity, url: string = "wss://wire.rupeezy.in/ws") {
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

    connect(): void {
        if (this.connection && (this.connection.readyState == WebSocket.CONNECTING || this.connection.readyState == WebSocket.OPEN)) return;
        // const url = this.url + "?auth_token=" + this.access_token + "&uid=" + (new Date().getTime().toString())
        const url = this.url + "?auth_token=" + this.access_token
        this.connection = new WebSocket.WebSocket(url)
        this.connection.binaryType = "arraybuffer"
        this.connection.onopen = () => {
            this.currentReconnectAttempts = 0
            this.trigger("connect"); 
        }

        this.connection.onerror = (e) => {
            this.trigger("error", [e]);

            // Force close to avoid ghost connections
            if (this.connection && this.connection.readyState == this.connection.OPEN) this.connection.close();
        }

        this.connection.onclose = (e) => {
            this.trigger("close", [e])
            if (this.auto_reconnect) this.tryReconnect();
        }

        this.connection.onmessage = (e) => {
            if( e.data instanceof ArrayBuffer){
                this.trigger("message", [e.data]);
                if (e.data.byteLength > 2) {
					const d = this.parseBinary(e.data);
					if (d) this.trigger("price_update", [d]);
				}
            }else{
                this.trigger("order_update",[e.data])
            }
        }
    }

    on(trigger_type: string, callback: Function) {
        if (this.triggers.hasOwnProperty(trigger_type)) {
            this.triggers[trigger_type].push(callback)
        }
    }
    trigger(e: string, args?: any) {
        if (!this.triggers[e]) return
        for (let n = 0; n < this.triggers[e].length; n++) {
            this.triggers[e][n].apply(this.triggers[e][n], args ? args : []);
        }
    }

    connected(): boolean {
        if (this.connection && this.connection.readyState == WebSocket.OPEN) {
            return true;
        } else {
            return false;
        }
    }
    disconnect(): void {
        if (this.connection && this.connection.readyState != this.connection.CLOSING && this.connection.readyState != this.connection.CLOSED) {
            this.trigger("disconnect")
            this.connection.close();
        }
    }

    subscribe(exchange: Constants.ExchangeTypes ,token: number, mode: Constants.QuoteModes ): void {
        const message = {"message_type":"subscribe", exchange,token,mode }
        if (!this.subscriptions[exchange])this.subscriptions[exchange] = []; 
        this.subscriptions[exchange][token] = mode; 
        this.send(message)
    }

    unsubscribe(exchange: Constants.ExchangeTypes ,token: number): void {
        const message = {"message_type":"unsubscribe", exchange,token }
        if(this.subscriptions[exchange] && this.subscriptions[token]) delete this.subscriptions[exchange][token]; 
        if( this.subscriptions[exchange].length == 0 ) delete this.subscriptions[exchange]
        this.send(message)
    }

    private send(message: any) {
		if (!this.connection || this.connection.readyState != this.connection.OPEN) return;

		try {
			if (typeof (message) == "object") {
				message = JSON.stringify(message);
			}
            console.log("sending message",message)

			this.connection.send(message);
		} catch (e) { this.connection.close(); };
	}

    private tryReconnect(): void {
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

    private parseBinary(data: ArrayBuffer): any{
        const packets = this.splitPackets(data)
        var price_updates:Constants.LtpQuoteData|Constants.FullQuoteData|Constants.OhlcvQuoteData[] = []; 
        for (let i = 0; i < packets.length; i++) {
            const packet  = packets[i];
            if( packet.byteLength == 22){
                var update = this._unpackLtpQuote(packet)
                price_updates.push(update)
            }else if (packet.byteLength == 62){
                var update2 = this._unpackOhlcvQuote(packet)
                price_updates.push(update2)
            }else if(packet.byteLength == 266){
                var update3 = this._unpackFullQuote(packet)
                price_updates.push(update3)
            }
        }

        return price_updates
    }

    private splitPackets(bin: ArrayBuffer){
        const dataView = new DataView(bin);
        let num = dataView.getInt16(0,true),
			j = 2,
			packets: ArrayBuffer[] = [];
		for (let i = 0; i < num; i++) {
			// first two bytes is the packet length
			const size = dataView.getInt16(j,true)
			var packet = bin.slice(j + 2, j + 2 + size);

			packets.push(packet);

			j += 2 + size;
		}

		return packets;
    }

    private _unpackInt(bin: ArrayBuffer, start: number, end: number, byteFormat: string = "H"): any {
        const dataView = new DataView(bin);
        const bytes = end - start;
        const littleEndian = true;
        if (byteFormat === "H") {
          // Unsigned 16-bit integer
          return dataView.getUint16(start, littleEndian);
        } else if (byteFormat === "I") {
          // Unsigned 32-bit integer
          return dataView.getUint32(start, littleEndian);
        } else if (byteFormat === "Q") {
          // Unsigned 64-bit integer (not supported by DataView)
          const highBits = dataView.getUint32(start, littleEndian);
          const lowBits = dataView.getUint32(start + 4, littleEndian);
          return Number((BigInt(highBits) << BigInt(32)) + BigInt(lowBits));
        } else {
          throw new Error("Unsupported byte format.");
        }
    }
    private _unpackString(dataView: DataView, offset: number, length: number): string {
        let str = "";
        for (let i = 0; i < length; i++) {
          const charCode = dataView.getUint8(offset + i);
          str += String.fromCharCode(charCode);
        }
        return str;
    }
    private _unpackLtpQuote(bin: ArrayBuffer):Constants.LtpQuoteData{
        const dataView = new DataView(bin);
        var quote:Constants.LtpQuoteData = {}
        let offset = 0;
        quote.exchange = this.rstrip(this._unpackString(dataView,offset,10))
        offset += 10 
        quote.token = dataView.getInt32(offset,true)
        offset += 4 
        quote.last_trade_price = dataView.getFloat64(offset,true)
        return quote
    }

    private _unpackOhlcvQuote(bin: ArrayBuffer):Constants.OhlcvQuoteData{
        const dataView = new DataView(bin);
        var quote:Constants.OhlcvQuoteData = {}
        let offset = 0;
        quote.exchange = this.rstrip(this._unpackString(dataView,offset,10))
        offset += 10 
        quote.token = dataView.getInt32(offset,true)
        offset += 4 
        quote.last_trade_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.last_trade_time = dataView.getInt32(offset,true)
        offset += 4
        quote.open_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.high_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.low_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.close_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.volume = dataView.getInt32(offset,true)
        offset += 4
        return quote
    }

    private _unpackFullQuote(bin: ArrayBuffer):Constants.FullQuoteData {
        const dataView = new DataView(bin);
        var quote:Constants.FullQuoteData = {}
        let offset = 0;
        quote.exchange = this.rstrip(this._unpackString(dataView,offset,10))
        offset += 10 
        quote.token = dataView.getInt32(offset,true)
        offset += 4 
        quote.last_trade_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.last_trade_time = dataView.getInt32(offset,true)
        offset += 4
        quote.open_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.high_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.low_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.close_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.volume = dataView.getInt32(offset,true)
        offset += 4
        quote.last_update_time = dataView.getInt32(offset,true)
        offset += 4
        quote.last_trade_quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.average_trade_price = dataView.getFloat64(offset,true)
        offset += 8
        quote.total_buy_quantity  = dataView.getBigInt64(offset,true)
        offset += 8
        quote.total_sell_quantity  = dataView.getBigInt64(offset,true)
        offset += 8
        quote.open_interest = dataView.getInt32(offset,true)
        offset += 4
        quote.depth = {buy: [
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
        ],sell: [
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
        ]}
        quote.depth.buy[0].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.buy[0].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.buy[0].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.depth.buy[1].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.buy[1].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.buy[1].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.depth.buy[2].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.buy[2].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.buy[2].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.depth.buy[3].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.buy[3].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.buy[3].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.depth.buy[4].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.buy[4].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.buy[4].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.depth.sell[0].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.sell[0].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.sell[0].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.depth.sell[1].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.sell[1].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.sell[1].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.depth.sell[2].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.sell[2].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.sell[2].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.depth.sell[3].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.sell[3].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.sell[3].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.depth.sell[4].price = dataView.getFloat64(offset,true)
        offset += 8
        quote.depth.sell[4].quantity = dataView.getInt32(offset,true)
        offset += 4
        quote.depth.sell[4].orders = dataView.getInt32(offset,true)
        offset += 4

        quote.dpr_high = dataView.getInt32(offset,true)
        offset += 4
        quote.dpr_low = dataView.getInt32(offset,true)

        return quote
    }

    private rstrip(str: string): string {
        const nullChar = '\x00';
        let endIndex = str.length - 1;
      
        while (endIndex >= 0 && str[endIndex] === nullChar) {
          endIndex--;
        }
      
        return str.substring(0, endIndex + 1);
      }
      
}
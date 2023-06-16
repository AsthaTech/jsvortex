import * as Constants from "./types";
export declare class VortexFeed {
    private connection;
    private url;
    private access_token;
    private reconnectInterval;
    private reconnectAttempts;
    private currentReconnectAttempts;
    private triggers;
    private subscriptions;
    private auto_reconnect;
    constructor(access_token: string, enable_logging: boolean, auto_reconnect?: boolean, reconnectInterval?: number, reconnectAttempts?: number, url?: string);
    connect(): void;
    on(trigger_type: string, callback: Function): void;
    trigger(e: string, args?: any): void;
    connected(): boolean;
    disconnect(): void;
    subscribe(exchange: Constants.ExchangeTypes, token: number, mode: Constants.QuoteModes): void;
    unsubscribe(exchange: Constants.ExchangeTypes, token: number): void;
    private send;
    private tryReconnect;
    private parseBinary;
    private splitPackets;
    private _unpackInt;
    private _unpackString;
    private _unpackLtpQuote;
    private _unpackOhlcvQuote;
    private _unpackFullQuote;
    private rstrip;
}

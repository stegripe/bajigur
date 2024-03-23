import { BaileysEvent, BaileysEventMap, WAProto } from "@whiskeysockets/baileys";

export interface IListener {
    meta: {
        name: BaileysEvent;
    };
    run: (data: BaileysEventMap[BaileysEvent]) => void;
}

export interface ICommand {
    meta: {
        name: string;
        aliases?: string[];
        description?: string;
        usage?: string;
        devOnly?: boolean;
        category?: string;
        allowSelfRun?: boolean;
    };
    run: (args: string[], data: WAProto.IWebMessageInfo) => void;
}

export interface IConfig {
    botName: string;
    stickerPack: string;
    prefix: string;
    devs: string[];
    mode: "development" | "production";
}

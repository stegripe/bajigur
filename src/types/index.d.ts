import { AuthenticationCreds, BaileysEvent, BaileysEventMap, proto } from "@adiwajshing/baileys";

export interface IListenerComponent {
    meta: {
        name: BaileysEvent;
    };
    executeEvent: (
        data: BaileysEventMap<AuthenticationCreds>[BaileysEvent]
    ) => void;
}

export interface ICommandComponent {
    meta: {
        name: string;
        aliases?: string[];
        description?: string;
        usage?: string;
        devOnly?: boolean;
        category?: string;
    };
    executeCommand: (args: string[], data: proto.IWebMessageInfo) => void;
}

export interface IWhatsAppBotConfig {
    botName: string;
    prefix: string;
    devs: string[];
    mode: "dev" | "prod";
}

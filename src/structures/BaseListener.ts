/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
import {
    AuthenticationCreds,
    BaileysEvent,
    BaileysEventMap
} from "@adiwajshing/baileys";
import { IListenerComponent } from "../types";
import { WhatsappBot } from "./WhatsappBot";

export abstract class BaseListener implements IListenerComponent {
    public constructor(
        public client: WhatsappBot,
        public readonly meta: IListenerComponent["meta"]
    ) {}

    public executeEvent(
        data: BaileysEventMap<AuthenticationCreds>[BaileysEvent]
    ): void {}
}

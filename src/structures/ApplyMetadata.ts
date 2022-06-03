import { ICommandComponent, IListenerComponent } from "../types";
import { WhatsAppBot } from "./WhatsAppBot";

export function ApplyMetadata<P extends ICommandComponent | IListenerComponent>(
    meta: P["meta"]
): any {
    return function decorate<T extends ICommandComponent | IListenerComponent>(
        target: new (...args: any[]) => T
    ): new (whatsappbot: WhatsAppBot) => T {
        return new Proxy(target, {
            construct: (ctx, [whatsappbot]): T => new ctx(whatsappbot, meta)
        });
    };
}

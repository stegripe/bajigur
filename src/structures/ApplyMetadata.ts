import { ICommandComponent, IListenerComponent } from "../types";
import { WhatsappBot } from "./WhatsappBot";

export function ApplyMetadata<P extends ICommandComponent | IListenerComponent>(
    meta: P["meta"]
): any {
    return function decorate<T extends ICommandComponent | IListenerComponent>(
        target: new (...args: any[]) => T
    ): new (client: WhatsappBot) => T {
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, meta)
        });
    };
}
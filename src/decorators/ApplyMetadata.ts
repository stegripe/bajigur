import BajigurClient from "#bajigur/structures/BajigurClient.js";
import { ICommand, IListener } from "#bajigur/types/index.js";

export default function ApplyMetadata<P extends ICommand | IListener>(meta: P["meta"]): any {
    return function decorate<T extends ICommand | IListener>(
        target: new (...args: any[]) => T
    ): new (client: BajigurClient) => T {
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, meta)
        });
    };
}

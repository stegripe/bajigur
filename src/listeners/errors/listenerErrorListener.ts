import { Listener, ListenerEvents, ListenerOptions } from "@clytage/liqueur";
import { ApplyOptions } from "@nezuchan/decorators";

@ApplyOptions<ListenerOptions>({
    event: ListenerEvents.ListenerError
})
export class ListenerError extends Listener {
    public run(error: unknown): void {
        return this.container.client.logger.error(error);
    }
}
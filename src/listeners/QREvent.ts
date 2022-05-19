import { ApplyMetadata } from "../structures/ApplyMetadata.js";
import { BaseListener } from "../structures/BaseListener.js";
import { IListenerComponent } from "../types/index.js";

@ApplyMetadata<IListenerComponent>({
    event: "qr.**"
})
export default class QREvent extends BaseListener {
    public execute(qrcode: unknown): void {
        console.log(qrcode);
    }
}

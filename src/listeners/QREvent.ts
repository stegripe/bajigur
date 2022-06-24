import { ApplyMetadata } from "../utils/decorators/ApplyMetadata";
import { BaseListener } from "../structures/BaseListener";
import { IListenerComponent } from "../types";

@ApplyMetadata<IListenerComponent>({
    event: "qr.**"
})
export default class QREvent extends BaseListener {
    public execute(qrcode: unknown): void {
        console.log(qrcode);
    }
}

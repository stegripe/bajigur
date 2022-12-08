/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { resolve } from "node:path";

export async function importClass<T>(
    path: string,
    ...args: any[]
): Promise<T | undefined> {
    const file = await import(resolve(path)).then(m => m.default);
    return file ? new file(...args) : undefined;
}

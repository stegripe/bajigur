import { resolve } from "node:path";

export async function importClass<T>(
    path: string,
    ...args: any[]
): Promise<T | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const file = await import(resolve(path)).then(m => m.default);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return file ? new file(...args) : undefined;
}

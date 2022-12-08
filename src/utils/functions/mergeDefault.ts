/* eslint-disable @typescript-eslint/no-dynamic-delete, @typescript-eslint/no-unsafe-member-access */
export function mergeDefault<T>(def: T, prov: T): T {
    const merged = { ...def, ...prov };
    const defKeys = Object.keys(def as Record<string, unknown>);
    for (const mergedKey of Object.keys(merged as Record<string, unknown>)) {
        if (!defKeys.includes(mergedKey)) delete (merged as any)[mergedKey];
    }
    return merged;
}

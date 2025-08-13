/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { convertDataToSerializable as _convertDataToSerializable } from "./convertDataToSerializable.ts";
import type { ArrayIndexToNotSerializableMaps, SerializableData, SerializableRef, WrappedSerializableData } from "./types.ts";

/**
 * Converts data that has been serialized with {@link _convertDataToSerializable|convertDataToSerializable} to the original format.
 *
 * @param wrappedData - The data that has been serialized with {@link _convertDataToSerializable|convertDataToSerializable}.
 * @returns The original data.
 */
export function convertDataFromSerializable(wrappedData: WrappedSerializableData): any {
    const maps: ArrayIndexToNotSerializableMaps = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call, no-new-func
        functions: new Map(wrappedData.functions.map((fn, index) => [index, new Function(`return ${fn}`)() as Function])),
        objects: new Map(wrappedData.objects.map((obj, index) => [index, { serializable: obj }])),
        symbols: new Map(wrappedData.symbols.map((sym, index) => [index, Symbol(sym)])),
    };

    return convertDataFromSerializableRecursive(wrappedData.data, maps);
}

function convertDataFromSerializableRecursive(data: SerializableData, maps: ArrayIndexToNotSerializableMaps): any {
    if (data === null || data === undefined) {
        return data;
    }

    if (typeof data === "string" || typeof data === "number" || typeof data === "bigint" || typeof data === "boolean") {
        return data;
    }

    const ref: SerializableRef = data;
    if (ref.type === "function") {
        const fn = maps.functions.get(ref.id);
        if (fn === undefined) {
            throw new Error(`Function with id ${ref.id.toString()} not found`);
        }
        return fn;
    }
    if (ref.type === "symbol") {
        const sym = maps.symbols.get(ref.id);
        if (sym === undefined) {
            throw new Error(`Symbol with id ${ref.id.toString()} not found`);
        }
        return sym;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (ref.type === "object") {
        const objData = maps.objects.get(ref.id);
        if (objData === undefined) {
            throw new Error(`Object with id ${ref.id.toString()} not found`);
        }
        if ("object" in objData) {
            return objData.object;
        }
        const serializable = objData.serializable;
        if (serializable.type === "instance") {
            return serializable.value;
        } else {
            const newObj: any = Array.isArray(serializable.value) ? [] : {};
            maps.objects.set(ref.id, { serializable: serializable, object: newObj });
            objData.object = newObj;
            for (const [key, value] of Object.entries(serializable.value)) {
                newObj[key] = convertDataFromSerializableRecursive(value, maps);
            }
            return newObj;
        }
    }

    throw new Error("Unsupported data type");
}

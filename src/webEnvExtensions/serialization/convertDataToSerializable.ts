/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { convertDataFromSerializable as _convertDataFromSerializable } from "./convertDataFromSerializable.ts";
import type { NotSerializableToArrayIndexMaps, SerializableArrayOrObject, SerializableData, WrappedSerializableData } from "./types.ts";

/**
 * Converts data to a serializable format that can be pass between Node.js and Web environments (and vice versa) through e.g. `page.evaluate`.
 * To convert data back to the original format, use {@link _convertDataFromSerializable|convertDataFromSerializable}.
 *
 * @param data - The data to convert to a serializable format.
 * @returns The serializable data.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function convertDataToSerializable(data: any): WrappedSerializableData {
    const maps: NotSerializableToArrayIndexMaps = {
        functions: new Map(),
        objects: new Map(),
        symbols: new Map(),
    };

    const serializableData = convertDataToSerializableRecursive(data, maps);

    return {
        functions: Array.from(maps.functions.entries()).map(([fn]) => fn.toString()),
        objects: Array.from(maps.objects.entries()).map(([_, obj]) => obj.serializable),
        symbols: Array.from(maps.symbols.entries()).map(([sym]) => sym.description ?? ""),
        data: serializableData,
    };
}

function convertDataToSerializableRecursive(data: any, maps: NotSerializableToArrayIndexMaps): SerializableData {
    if (data === null || data === undefined) {
        return data;
    }

    if (typeof data === "string" || typeof data === "number" || typeof data === "bigint" || typeof data === "boolean") {
        return data;
    }

    if (typeof data === "function") {
        const id = maps.functions.get(data);
        if (id !== undefined) {
            return { type: "function", id };
        }
        const newId = maps.functions.size;
        maps.functions.set(data, newId);
        return { type: "function", id: newId };
    }

    if (typeof data === "symbol") {
        const id = maps.symbols.get(data);
        if (id !== undefined) {
            return { type: "symbol", id };
        }
        const newId = maps.symbols.size;
        maps.symbols.set(data, newId);
        return { type: "symbol", id: newId };
    }

    if (typeof data === "object") {
        const id = maps.objects.get(data);
        if (id !== undefined) {
            return { type: "object", id: id.index };
        }

        // Add the object to the map before serializing it to support circular references
        const newId = maps.objects.size;
        maps.objects.set(data, { index: newId, serializable: null as any });

        const serializable: SerializableArrayOrObject = Array.isArray(data)
            ? { type: "array", value: data.map((item) => convertDataToSerializableRecursive(item, maps)) }
            : isPlainObject(data)
              ? { type: "plainObject", value: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, convertDataToSerializableRecursive(value, maps)])) }
              : { type: "instance", value: data };
        maps.objects.set(data, { index: newId, serializable });
        return { type: "object", id: newId };
    }

    throw new Error(`Unsupported data type: ${typeof data}`);
}

// https://github.com/lodash/lodash/blob/main/lodash.js
function isPlainObject(value: any): boolean {
    if (value === null || typeof value !== "object") {
        return false;
    }
    if (Object.prototype.toString.call(value) !== "[object Object]") {
        return false;
    }
    const proto = Object.getPrototypeOf(Object(value));
    if (proto === null) {
        return true;
    }
    const Ctor = Object.hasOwn(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
}

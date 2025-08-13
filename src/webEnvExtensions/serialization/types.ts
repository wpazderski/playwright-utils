import type { convertDataFromSerializable as _convertDataFromSerializable } from "./convertDataFromSerializable.ts";
import type { convertDataToSerializable as _convertDataToSerializable } from "./convertDataToSerializable.ts";

/**
 * Serializable data returned by {@link _convertDataToSerializable|convertDataToSerializable} that can be passed between Node.js and Web environments (and vice versa) through e.g. `page.evaluate`.
 * To convert data back to the original format, use {@link _convertDataFromSerializable|convertDataFromSerializable}.
 */
export interface WrappedSerializableData {
    /**
     * Functions represented as strings.
     */
    functions: string[];

    /**
     * Objects represented as serializable data.
     */
    objects: SerializableArrayOrObject[];

    /**
     * Symbols represented as strings.
     */
    symbols: string[];

    /**
     * The data that has been serialized.
     */
    data: SerializableData;
}

/**
 * Represents data that can be serialized and deserialized.
 * It can be a serializable primitive value or a reference to a function/object/symbol.
 */
export type SerializableData = string | number | bigint | boolean | undefined | null | SerializableRef;

/**
 * Represents a reference to a function, object, or symbol.
 * It contains the type of the reference and an identifier that can be used to retrieve the original value.
 */
export interface SerializableRef {
    /**
     * The type of the reference.
     */
    type: "function" | "object" | "symbol";

    /**
     * The identifier that can be used to retrieve the original value.
     * It is an index in the corresponding array of non-serializable values.
     */
    id: number;
}

/**
 * Maps where non-serializable values (functions, objects, symbols) are stored as keys with their corresponding array indexes as values.
 * It is used to convert data to a serializable format that can be passed between Node.js and Web environments (and vice versa).
 */
export interface NotSerializableToArrayIndexMaps {
    /**
     * Functions mapped to their array indexes.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    functions: Map<Function, number>;

    /**
     * Objects mapped to their array indexes, along with their serializable representation.
     */
    objects: Map<
        object,
        {
            /**
             * The index of the object in the array.
             */
            index: number;

            /**
             * The serializable representation of the object.
             */
            serializable: SerializableArrayOrObject;
        }
    >;

    /**
     * Symbols mapped to their array indexes.
     */
    symbols: Map<symbol, number>;
}

/**
 * Maps where non-serializable values (functions, objects, symbols) are stored as values with their corresponding array indexes as keys.
 * It is used to convert data from a serializable format back to the original format.
 */
export interface ArrayIndexToNotSerializableMaps {
    /**
     * Array indexes of functions mapped to the actual function values.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    functions: Map<number, Function>;

    /**
     * Array indexes of objects mapped to their serializable representation and optionally the actual object value.
     */
    objects: Map<
        number,
        {
            /**
             * The serializable representation of the object.
             */
            serializable: SerializableArrayOrObject;

            /**
             * The actual object value, if available.
             */
            object?: object;
        }
    >;

    /**
     * Array indexes of symbols mapped to the actual symbol values.
     */
    symbols: Map<number, symbol>;
}

/**
 * Represents an array that can be serialized.
 */
export interface SerializableArray {
    /**
     * The type of the serializable data.
     */
    type: "array";

    /**
     * The value of serializable data.
     */
    value: SerializableData[];
}

/**
 * Represents a plain object that can be serialized.
 */
export interface SerializablePlainObject {
    /**
     * The type of the serializable data.
     */
    type: "plainObject";

    /**
     * The value of serializable data.
     */
    value: Record<string, SerializableData>;
}

/**
 * Represents an instance of a class that can be serialized.
 */
export interface SerializableInstance {
    /**
     * The type of the serializable data.
     */
    type: "instance";

    /**
     * The value of serializable data.
     */
    value: object;
}

/**
 * Represents an array or object that can be serialized.
 * It can be an array, a plain object, or an instance of a class.
 */
export type SerializableArrayOrObject = SerializableArray | SerializablePlainObject | SerializableInstance;

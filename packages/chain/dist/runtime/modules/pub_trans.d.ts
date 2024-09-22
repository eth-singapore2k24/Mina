import { RuntimeModule } from "@proto-kit/module";
import { StateMap } from "@proto-kit/protocol";
import { Bool, PublicKey, CircuitString } from "o1js";
declare const PublisherRec_base: (new (value: {
    pubId: import("o1js/dist/node/lib/provable/field").Field;
    pubURL: CircuitString;
    pubTag: CircuitString;
    isActive: import("o1js/dist/node/lib/provable/bool").Bool;
}) => {
    pubId: import("o1js/dist/node/lib/provable/field").Field;
    pubURL: CircuitString;
    pubTag: CircuitString;
    isActive: import("o1js/dist/node/lib/provable/bool").Bool;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    pubId: import("o1js/dist/node/lib/provable/field").Field;
    pubURL: CircuitString;
    pubTag: CircuitString;
    isActive: import("o1js/dist/node/lib/provable/bool").Bool;
}, {
    pubId: bigint;
    pubURL: string;
    pubTag: string;
    isActive: boolean;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        pubId: import("o1js/dist/node/lib/provable/field").Field;
        pubURL: CircuitString;
        pubTag: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    };
} & {
    fromValue: (value: {
        pubId: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        pubURL: string | CircuitString | {
            values: import("o1js").Character[];
        };
        pubTag: string | CircuitString | {
            values: import("o1js").Character[];
        };
        isActive: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        pubId: import("o1js/dist/node/lib/provable/field").Field;
        pubURL: CircuitString;
        pubTag: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    toInput: (x: {
        pubId: import("o1js/dist/node/lib/provable/field").Field;
        pubURL: CircuitString;
        pubTag: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        pubId: import("o1js/dist/node/lib/provable/field").Field;
        pubURL: CircuitString;
        pubTag: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        pubId: string;
        pubURL: {
            values: {
                value: string;
            }[];
        };
        pubTag: {
            values: {
                value: string;
            }[];
        };
        isActive: boolean;
    };
    fromJSON: (x: {
        pubId: string;
        pubURL: {
            values: {
                value: string;
            }[];
        };
        pubTag: {
            values: {
                value: string;
            }[];
        };
        isActive: boolean;
    }) => {
        pubId: import("o1js/dist/node/lib/provable/field").Field;
        pubURL: CircuitString;
        pubTag: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    empty: () => {
        pubId: import("o1js/dist/node/lib/provable/field").Field;
        pubURL: CircuitString;
        pubTag: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    };
};
export declare class PublisherRec extends PublisherRec_base {
    static from(pubId: import("o1js/dist/node/lib/provable/field").Field | undefined, pubURL: CircuitString, pubTag: CircuitString, isActive?: Bool): PublisherRec;
}
export declare class Publish extends RuntimeModule<unknown> {
    records: StateMap<CircuitString, PublisherRec>;
    totalRecord: StateMap<PublicKey, import("o1js/dist/node/lib/provable/field").Field>;
    tokenPerUrl: StateMap<CircuitString, import("o1js/dist/node/lib/provable/field").Field>;
    storeOrUpdateRecord(key: PublicKey, pubTags: CircuitString, pubURL: CircuitString): Promise<void>;
    getRecord(key: PublicKey, pubURL: CircuitString): Promise<CircuitString>;
}
export {};
//# sourceMappingURL=pub_trans.d.ts.map
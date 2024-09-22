import { RuntimeModule } from "@proto-kit/module";
import { State, StateMap } from "@proto-kit/protocol";
import { Bool, CircuitString } from "o1js";
declare const AdvertisementRec_base: (new (value: {
    adId: import("o1js/dist/node/lib/provable/field").Field;
    adURL: CircuitString;
    adImgUrl: CircuitString;
    isActive: import("o1js/dist/node/lib/provable/bool").Bool;
}) => {
    adId: import("o1js/dist/node/lib/provable/field").Field;
    adURL: CircuitString;
    adImgUrl: CircuitString;
    isActive: import("o1js/dist/node/lib/provable/bool").Bool;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    adId: import("o1js/dist/node/lib/provable/field").Field;
    adURL: CircuitString;
    adImgUrl: CircuitString;
    isActive: import("o1js/dist/node/lib/provable/bool").Bool;
}, {
    adId: bigint;
    adURL: string;
    adImgUrl: string;
    isActive: boolean;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        adId: import("o1js/dist/node/lib/provable/field").Field;
        adURL: CircuitString;
        adImgUrl: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    };
} & {
    fromValue: (value: {
        adId: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        adURL: string | CircuitString | {
            values: import("o1js").Character[];
        };
        adImgUrl: string | CircuitString | {
            values: import("o1js").Character[];
        };
        isActive: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        adId: import("o1js/dist/node/lib/provable/field").Field;
        adURL: CircuitString;
        adImgUrl: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    toInput: (x: {
        adId: import("o1js/dist/node/lib/provable/field").Field;
        adURL: CircuitString;
        adImgUrl: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        adId: import("o1js/dist/node/lib/provable/field").Field;
        adURL: CircuitString;
        adImgUrl: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        adId: string;
        adURL: {
            values: {
                value: string;
            }[];
        };
        adImgUrl: {
            values: {
                value: string;
            }[];
        };
        isActive: boolean;
    };
    fromJSON: (x: {
        adId: string;
        adURL: {
            values: {
                value: string;
            }[];
        };
        adImgUrl: {
            values: {
                value: string;
            }[];
        };
        isActive: boolean;
    }) => {
        adId: import("o1js/dist/node/lib/provable/field").Field;
        adURL: CircuitString;
        adImgUrl: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    empty: () => {
        adId: import("o1js/dist/node/lib/provable/field").Field;
        adURL: CircuitString;
        adImgUrl: CircuitString;
        isActive: import("o1js/dist/node/lib/provable/bool").Bool;
    };
};
export declare class AdvertisementRec extends AdvertisementRec_base {
    static from(adId: import("o1js/dist/node/lib/provable/field").Field | undefined, adURL: CircuitString, adImgUrl: CircuitString, isActive?: Bool): AdvertisementRec;
}
export declare class Advertisements extends RuntimeModule<unknown> {
    records: StateMap<CircuitString, AdvertisementRec>;
    totalRecord: State<import("o1js/dist/node/lib/provable/field").Field>;
    storeOrUpdateRecord(adTag: CircuitString, adURL: CircuitString, adImgUrl: CircuitString): Promise<void>;
    getRecord(adTag: CircuitString): Promise<AdvertisementRec>;
    getTotalRecords(): Promise<import("@proto-kit/protocol").Option<import("o1js/dist/node/lib/provable/field").Field>>;
}
export {};
//# sourceMappingURL=adv_trans.d.ts.map
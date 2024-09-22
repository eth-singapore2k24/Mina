import { ModulesConfig } from "@proto-kit/common";
import { Balances } from "./modules/balances";
import { Advertisements } from "./modules/adv_trans";
import { Publish } from "./modules/pub_trans";
export declare const modules: {
    Balances: typeof import("@proto-kit/library").Balances;
} & {
    Balances: typeof Balances;
    Advertisements: typeof Advertisements;
    Publish: typeof Publish;
};
export declare const config: ModulesConfig<typeof modules>;
declare const _default: {
    modules: {
        Balances: typeof import("@proto-kit/library").Balances;
    } & {
        Balances: typeof Balances;
        Advertisements: typeof Advertisements;
        Publish: typeof Publish;
    };
    config: ModulesConfig<{
        Balances: typeof import("@proto-kit/library").Balances;
    } & {
        Balances: typeof Balances;
        Advertisements: typeof Advertisements;
        Publish: typeof Publish;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map
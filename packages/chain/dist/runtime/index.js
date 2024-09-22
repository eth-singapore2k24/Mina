import { Balance, VanillaRuntimeModules } from "@proto-kit/library";
import { Balances } from "./modules/balances";
import { Advertisements } from "./modules/adv_trans";
import { Publish } from "./modules/pub_trans";
export const modules = VanillaRuntimeModules.with({
    Balances,
    Advertisements,
    Publish,
});
export const config = {
    Balances: {
        totalSupply: Balance.from(10000),
    },
    Advertisements: {},
    Publish: {},
};
export default {
    modules,
    config,
};

import { Balance, VanillaRuntimeModules } from "@proto-kit/library";
import { ModulesConfig } from "@proto-kit/common";

import { Balances } from "./modules/balances";
import { Advertisements } from "./modules/adv_trans";
import { Publish } from "./modules/pub_trans";
import { Tokenize } from "./modules/tokenizers";

export const modules = VanillaRuntimeModules.with({
  Balances,
  Tokenize ,
  Advertisements,
  Publish,
   
});

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
  },
  Tokenize: {},
  Advertisements: {},
  Publish: {},
  
};

export default {
  modules,
  config,
};

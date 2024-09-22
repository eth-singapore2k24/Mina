var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import { runtimeModule, state, runtimeMethod } from "@proto-kit/module";
import { runtimeMethod, RuntimeModule, runtimeModule, state } from "@proto-kit/module";
import { StateMap } from "@proto-kit/protocol";
// import { State, assert } from "@proto-kit/protocol";
// import { Balance, Balances as BaseBalances, TokenId } from "@proto-kit/library";
import { Bool, Field, PublicKey, Struct, CircuitString } from "o1js";
// import { PublicKey } from "o1js";
// interface BalancesConfig {
//   totalSupply: Balance;
// }
export class PublisherRec extends Struct({
    pubId: Field,
    pubURL: CircuitString,
    pubTag: CircuitString,
    isActive: Bool,
}) {
    static from(pubId = Field(0), pubURL, pubTag, isActive = Bool(true)) {
        return new PublisherRec({
            pubId,
            pubURL,
            pubTag,
            isActive,
        });
    }
}
let Publish = class Publish extends RuntimeModule {
    constructor() {
        super(...arguments);
        this.records = StateMap.from(CircuitString, PublisherRec);
        this.totalRecord = StateMap.from(PublicKey, Field);
        this.tokenPerUrl = StateMap.from(CircuitString, Field);
        //   @runtimeMethod() 
        //   public async getTotalRecords () {
        //     const totalRec = await this.totalRecord.get();
        //     return totalRec;
        //   }
    }
    async storeOrUpdateRecord(key, pubTags, pubURL) {
        // assert(
        //   this.transaction.sender.value.equals(ownerPublicKey),
        //   "Only the owner can store or update their record"
        // );
        // Provable.runUnchecked(async () =>{
        const currentCount = await this.totalRecord.get(key);
        // let newCurrentCount = currentCount;
        const keyString = key.toBase58();
        const urlString = pubURL.toString();
        let Key = CircuitString.fromString(keyString + "." + urlString);
        let currentUrlCount = await this.tokenPerUrl.get(Key);
        if (currentUrlCount.value == Field(0)) {
            await this.totalRecord.set(key, Field.from(currentCount.value.add(1)));
        }
        let newCurrentCount = await this.totalRecord.get(key);
        const tokens = pubTags.toString().replace(/[\[\]"]/g, '').split(',').map(s => s.trim());
        tokens.forEach(async (token) => {
            let currentCount = await this.tokenPerUrl.get(Key);
            await this.tokenPerUrl.set(Key, Field.from(currentCount.value.add(1)));
            let newCurrentCount = await this.tokenPerUrl.get(Key);
            let newString = newCurrentCount.value.toString();
            let key2 = CircuitString.fromString(keyString + "." + urlString + "." + newString);
            let tt = CircuitString.fromString(token);
            // console.log(token);
            let newRecord = new PublisherRec({
                pubId: newCurrentCount.value,
                pubURL,
                pubTag: tt,
                isActive: Bool(true)
            });
            await this.records.set(key2, newRecord);
        });
        // });
    }
    //   @runtimeMethod()
    async getRecord(key, pubURL
    // adTag: CircuitString
    ) {
        const keyString = key.toBase58();
        const urlString = pubURL.toString();
        let Key = CircuitString.fromString(keyString + "." + urlString);
        let newCurrentCount = await this.tokenPerUrl.get(Key);
        let d = "[";
        for (let i = 1; newCurrentCount.value.greaterThanOrEqual(i); i++) {
            let newKey = CircuitString.fromString(Key.toString() + "." + i.toString());
            let rec = await this.records.get(newKey);
            d += "\"" + rec.value.pubTag + "\",";
            console.log(rec.value.pubTag);
        }
        d += "]";
        return CircuitString.fromString(d);
    }
};
__decorate([
    state(),
    __metadata("design:type", Object)
], Publish.prototype, "records", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Publish.prototype, "totalRecord", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Publish.prototype, "tokenPerUrl", void 0);
__decorate([
    runtimeMethod(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey,
        CircuitString,
        CircuitString]),
    __metadata("design:returntype", Promise)
], Publish.prototype, "storeOrUpdateRecord", null);
Publish = __decorate([
    runtimeModule()
], Publish);
export { Publish };
// @runtimeModule()
// export class Balances extends BaseBalances<BalancesConfig> {
//   @state() public circulatingSupply = State.from<Balance>(Balance);
//   @runtimeMethod()
//   public async addBalance(
//     tokenId: TokenId,
//     address: PublicKey,
//     amount: Balance
//   ): Promise<void> {
//     const circulatingSupply = await this.circulatingSupply.get();
//     const newCirculatingSupply = Balance.from(circulatingSupply.value).add(
//       amount
//     );
//     assert(
//       newCirculatingSupply.lessThanOrEqual(this.config.totalSupply),
//       "Circulating supply would be higher than total supply"
//     );
//     await this.circulatingSupply.set(newCirculatingSupply);
//     await this.mint(tokenId, address, amount);
//   }
// }

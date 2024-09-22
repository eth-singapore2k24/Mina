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
import { assert, State, StateMap } from "@proto-kit/protocol";
// import { State, assert } from "@proto-kit/protocol";
// import { Balance, Balances as BaseBalances, TokenId } from "@proto-kit/library";
import { Bool, Field, Struct, CircuitString } from "o1js";
// import { PublicKey } from "o1js";
// interface BalancesConfig {
//   totalSupply: Balance;
// }
export class AdvertisementRec extends Struct({
    adId: Field,
    adURL: CircuitString,
    adImgUrl: CircuitString,
    isActive: Bool,
}) {
    static from(adId = Field(0), adURL, adImgUrl, isActive = Bool(true)) {
        return new AdvertisementRec({
            adId,
            adURL,
            adImgUrl,
            isActive,
        });
    }
}
let Advertisements = class Advertisements extends RuntimeModule {
    constructor() {
        super(...arguments);
        this.records = StateMap.from(CircuitString, AdvertisementRec);
        this.totalRecord = State.from(Field);
    }
    async storeOrUpdateRecord(adTag, adURL, adImgUrl) {
        // assert(
        //   this.transaction.sender.value.equals(ownerPublicKey),
        //   "Only the owner can store or update their record"
        // );
        const currentCount = await this.totalRecord.get();
        await this.totalRecord.set(Field.from(currentCount.value.add(1)));
        const newCurrentCount = await this.totalRecord.get();
        const newRecord = new AdvertisementRec({
            adId: newCurrentCount.value,
            adURL,
            adImgUrl,
            isActive: Bool(true)
        });
        await this.records.set(adTag, newRecord);
    }
    async getRecord(adTag) {
        const record = await this.records.get(adTag);
        assert(record.isSome, "Record not found");
        return record.value;
    }
    async getTotalRecords() {
        const totalRec = await this.totalRecord.get();
        return totalRec;
    }
};
__decorate([
    state(),
    __metadata("design:type", Object)
], Advertisements.prototype, "records", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Advertisements.prototype, "totalRecord", void 0);
__decorate([
    runtimeMethod(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CircuitString,
        CircuitString,
        CircuitString]),
    __metadata("design:returntype", Promise)
], Advertisements.prototype, "storeOrUpdateRecord", null);
__decorate([
    runtimeMethod(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CircuitString]),
    __metadata("design:returntype", Promise)
], Advertisements.prototype, "getRecord", null);
__decorate([
    runtimeMethod(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Advertisements.prototype, "getTotalRecords", null);
Advertisements = __decorate([
    runtimeModule()
], Advertisements);
export { Advertisements };
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

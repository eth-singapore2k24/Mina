// import { runtimeModule, state, runtimeMethod } from "@proto-kit/module";
import { runtimeMethod, RuntimeModule, runtimeModule, state } from "@proto-kit/module";
import { assert, State, StateMap } from "@proto-kit/protocol";
import { Balance, TokenId, UInt64 } from "@proto-kit/library";
// import { State, assert } from "@proto-kit/protocol";
// import { Balance, Balances as BaseBalances, TokenId } from "@proto-kit/library";
import { Bool, Field, Poseidon, Provable, PublicKey, Struct, CircuitString } from "o1js";
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
    public static from(
        adId: Field = Field(0),
        adURL: CircuitString,
        adImgUrl: CircuitString,
        isActive: Bool = Bool(true)
    ) {
        return new AdvertisementRec({
            adId,
            adURL,
            adImgUrl,
            isActive,
        });
    }
}



@runtimeModule()
export class Advertisements extends RuntimeModule<unknown> {
  @state() public records = StateMap.from<CircuitString, AdvertisementRec>(
    CircuitString,
    AdvertisementRec
  );
  @state() public totalRecord = State.from(Field);

  @runtimeMethod()
  public async storeOrUpdateRecord(
    adTag: CircuitString,
    adURL: CircuitString,
    adImgUrl: CircuitString,
  ) {
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
        isActive : Bool(true)
    });
    await this.records.set(adTag, newRecord);
  }

  @runtimeMethod()
  public async getRecord(
    adTag: CircuitString
  ): Promise<AdvertisementRec> {
    const record = await this.records.get(adTag);
    assert(record.isSome, "Record not found");
    return record.value;
  }

  @runtimeMethod() 
  public async getTotalRecords () {
    const totalRec = await this.totalRecord.get();
    return totalRec;
  }
}



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

// import { runtimeModule, state, runtimeMethod } from "@proto-kit/module";
import { runtimeMethod, RuntimeModule, runtimeModule, state } from "@proto-kit/module";
import { assert, State, StateMap } from "@proto-kit/protocol";
import { Balance, TokenId, UInt64 } from "@proto-kit/library";
// import { State, assert } from "@proto-kit/protocol";
// import { inject } from "tsyringe";
import { Advertisements, AdvertisementRec } from "./adv_trans";
// import { Balance, Balances as BaseBalances, TokenId } from "@proto-kit/library";
import { Bool, Field, Poseidon, Provable, PublicKey, Struct, CircuitString, ZkProgram } from "o1js";
// import { PublicKey } from "o1js";

const MAX_PATH_LENGTH = 5


export class TokenMapperPublicOutput extends Struct({
    adURL: CircuitString,
    adImgUrl: CircuitString,
}) {}

export const tokenMap = ZkProgram({
  name: "tokenMap",
  publicInput: CircuitString,
  publicOutput: TokenMapperPublicOutput,

  methods: {
    tokenMapper: {
      privateInputs: [],
      method: tokenMapper,
    },
  },
});

export class tokenMapperProof extends ZkProgram.Proof(tokenMap) {}

export async function tokenMapper(token: CircuitString) : Promise<TokenMapperPublicOutput>{
    const advertisements = new Advertisements();
    // const record = (await advertisements.records.get(token)).value;
    const record = new AdvertisementRec({
        adId: Field(0),
        adURL: CircuitString.fromString("https://www.google.com"),
        adImgUrl: CircuitString.fromString("https://www.google.com"),
        isActive: Bool(true)
    }) 
    // expect(record).toBeDefined();
    const tokenMapper = new TokenMapperPublicOutput({
        adURL: record.adURL,
        adImgUrl: record.adImgUrl,
    });
    return tokenMapper
}


export class arrayTag extends Struct({
    tagArray: Provable.Array(CircuitString, MAX_PATH_LENGTH) 
}) {
    public static from(
        tagArray: CircuitString[]
    ) {
        return new arrayTag({
            tagArray
        });
    }
}

@runtimeModule()
export class Tokenize extends RuntimeModule<Record<string, never>> {
  @state() public tagMap = StateMap.from<PublicKey, arrayTag>(
    PublicKey,
    arrayTag
  );
  @state() public totalRecord = StateMap.from<PublicKey, Field>(
    PublicKey,
    Field
  );

//   public constructor(@inject("Advertisements") public adv: Advertisements) {
//     super();
//   }

  @runtimeMethod()
  public async storeOrUpdateTagMap(
    key: PublicKey,
    pubTags: CircuitString,
  ) {
    assert(
      this.transaction.sender.value.equals(key),
      "Only the owner can store or update their record"
    );
    // Provable.runUnchecked(async () =>{
    Provable.asProver(async () => {
        console.log("Inside StoreOrUpdateRecord");
        console.log(key + " -> " + pubTags);
    });
    
    const currentCount = await this.totalRecord.get(key);
    if(currentCount.value == Field(0)) {
        let pubArrayNew = [pubTags];
        await this.tagMap.set(key, arrayTag.from(pubArrayNew))
        await this.totalRecord.set(key, Field.from(currentCount.value.add(1)));
    }
    else {
      const currentRecords = await this.tagMap.get(key);
      let pubArray = currentRecords.value.tagArray;
      let pubArrayNew = [ ...pubArray ,pubTags];
      await this.tagMap.set(key, arrayTag.from(pubArrayNew))
      await this.totalRecord.set(key, Field.from(currentCount.value.add(1)));
  }

  }

}

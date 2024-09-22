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
const MAX_PATH_LENGTH = 5



// export class PublisherRec extends Struct({
//     // pubId: Field,
//     pubTokens: CircuitString,
//     // pubTag: CircuitString,
//     isActive: Bool,
// }) {
//     public static from(
//         // pubId: Field = Field(0),
//         pubTokens: CircuitString,   
//         // pubTag: CircuitString,
//         isActive: Bool = Bool(true)
//     ) {
//         return new PublisherRec({
//             // pubId,
//             pubTokens,
//             // pubTag,
//             isActive,
//         });
//     }
// }

export class arrayPub extends Struct({
    pubArray: Provable.Array(CircuitString, MAX_PATH_LENGTH) 
    // pubTag: CircuitString,
    // isActive: Bool,
}) {
    public static from(
        pubArray: CircuitString[]
    ) {
        return new arrayPub({
            pubArray
        });
    }
}


@runtimeModule()
export class Publish extends RuntimeModule<Record<string, never>> {
  @state() public records = StateMap.from<PublicKey, arrayPub>(
    PublicKey,
    arrayPub
  );
  @state() public totalRecord = StateMap.from<PublicKey, Field>(
    PublicKey,
    Field
  );
  // @state() public tokenPerUrl= StateMap.from<CircuitString, Field>(
  //   CircuitString,
  //   Field
  // );



  @runtimeMethod()
  public async storeOrUpdateRecord(
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
        await this.records.set(key, arrayPub.from(pubArrayNew))
        await this.totalRecord.set(key, Field.from(currentCount.value.add(1)));
    }
    else {
      const currentRecords = await this.records.get(key);
      let pubArray = currentRecords.value.pubArray;
      let pubArrayNew = [ ...pubArray ,pubTags];
      await this.records.set(key, arrayPub.from(pubArrayNew))
      await this.totalRecord.set(key, Field.from(currentCount.value.add(1)));
  }

    // let newCurrentCount = currentCount;
    // const keyString = key.toBase58();
    // const urlString = pubURL.toString();
    // let Key = CircuitString.fromString(keyString+"."+urlString);
    // let currentUrlCount = await this.tokenPerUrl.get(Key);
    // if(currentUrlCount.value == Field(0)) {
    //     await this.totalRecord.set(key, Field.from(currentCount.value.add(1)));
    // }
    // let newCurrentCount = await this.totalRecord.get(key);
    // const tokens = pubTags.toString().replace(/[\[\]"]/g, '').split(',').map(s => s.trim());
    // tokens.forEach(async token => {
    //     let currentCount = await this.tokenPerUrl.get(Key);
    //     await this.tokenPerUrl.set(Key, Field.from(currentCount.value.add(1)));
    //     let newCurrentCount = await this.tokenPerUrl.get(Key);
    //     let newString = newCurrentCount.value.toString();
    //     let key2 = CircuitString.fromString(keyString+"."+urlString + "." + newString);
    //     let tt = CircuitString.fromString(token);
    //     // console.log(token);
    //     let newRecord = new PublisherRec({
    //         pubId: newCurrentCount.value,
    //         pubURL,
    //         pubTag: tt,
    //         isActive : Bool(true)
    //     });
    //     await this.records.set(key2, newRecord);
    // });
  // })
// });
  }


  // @runtimeMethod()
    public async getRecord(
    key: PublicKey
    // adTag: CircuitString
  ): Promise<CircuitString[]> {
    const currentCount = await this.totalRecord.get(key);
    // let d = "[";
    if(currentCount.value == Field(0)) {
        // d+="]";
        let pubArray: CircuitString[] = [];
        return pubArray;
    }
    const currentRecords = await this.records.get(key);
    let pubArray = currentRecords.value.pubArray;
    // pubArray.forEach( pub => {
    //     d+= "\""+pub.toString()+"\",";
    // });
    // d+="]";
    return pubArray;
    // const keyString = key.toBase58();
    // const urlString = pubURL.toString();
    // let Key = CircuitString.fromString(keyString+"."+urlString);
    
    // let newCurrentCount = await this.tokenPerUrl.get(Key);
    // let d = "[";
    // for (let i = 1; newCurrentCount.value.greaterThanOrEqual(i); i++) {

    //     let newKey = CircuitString.fromString(Key.toString()+"."+ i.toString());
    //     let rec = await this.records.get(newKey);
    //     d+= "\""+rec.value.pubTag+"\",";
    //     console.log(rec.value.pubTag);
    // }
    // d+="]";
    // return CircuitString.fromString(d);
  }
  // @runtimeMethod()

  public async getTotalRecords (key: PublicKey) {
    const totalRec = await this.totalRecord.get(key);
    return totalRec;
  }
}

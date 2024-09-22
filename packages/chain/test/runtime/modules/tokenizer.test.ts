// import * as crypto from "node:crypto";
import { TestingAppChain } from "@proto-kit/sdk";
import { UInt64 } from "@proto-kit/library";
import { PrivateKey, CircuitString, Field } from "o1js";
import {
  AdvertisementRec, Advertisements
} from "../../../src/runtime/modules/adv_trans";
import {
  Publish
} from "../../../src/runtime/modules/pub_trans";
import {
    TokenMapperPublicOutput,
    tokenMapperProof,
    Tokenize, arrayTag,
    tokenMap,
    tokenMapper
} from "../../../src/runtime/modules/tokenizers";
import { Balances } from "../../../src/runtime/modules/balances";

describe("Tokenize", () => {
  let appChain: any;
  let tokenize: Tokenize;
  const alicePrivateKey = PrivateKey.random();
  const alice = alicePrivateKey.toPublicKey();
    let proof: tokenMapperProof;

 async function realProof(
    publicOutput: TokenMapperPublicOutput
  ): Promise<tokenMapperProof> {
    console.log("compiling airdrop program");
    console.time("compile");
    await tokenMap.compile();
    console.timeEnd("compile");

    console.log("generating airdrop proof");
    console.time("proof");
    const proof = await tokenMap.tokenMapper(CircuitString.fromString("Tag1"));
    console.timeEnd("proof");
    console.log("proof", proof.toJSON());
    return proof;
  }
  async function mockProof(
    publicOutput: TokenMapperPublicOutput
  )
//   : Promise<tokenMapperProof> 
  {
    console.log("generating mock proof");
    console.time("mockProof");
    const proof = await tokenMapperProof.dummy(undefined, publicOutput, 0);
    console.timeEnd("mockProof");
    return proof;
  }

  // const encryptionKey = crypto.randomBytes(32).toString("hex"); // 256-bit key

  beforeAll(async () => {
    appChain = TestingAppChain.fromRuntime({
      Balances,
      Advertisements,
      Publish,
      Tokenize,
    });

    appChain.configurePartial({
      Runtime: {
        Balances: {
          totalSupply: UInt64.from(10000),
        },
        Advertisements: {},
        Publish: {},
        Tokenize: {},
      },
    });
    await appChain.start();
    appChain.setSigner(alicePrivateKey);
    tokenize = appChain.runtime.resolve("Tokenize");

    let proof = await mockProof(await tokenMapper(CircuitString.fromString("Tag1")));
    console.log("proof", proof);
    // proof = await realProof(await tokenMapper(CircuitString.fromString("Tag1")));
  });

  it("should Maintain user's tokens", async () => {    
    // Store record
    let tx = await appChain.transaction(alice, async () => {
      await tokenize.storeOrUpdateTagMap(alice, CircuitString.fromString("Tag1"))});
    await tx.sign();
    await tx.send();
    await appChain.produceBlock();

    let retrievedRecordCount = await appChain.query.runtime.Tokenize.totalRecord.get(alice);

    if(retrievedRecordCount >0){
        // Retrieve and verify tokenMaps
        let retrievedRecord = 
        await appChain.query.runtime.Tokenize.tagMap.get(alice);
        expect(retrievedRecord).toBeDefined();
        // if (retrievedRecord) {
        let data = retrievedRecord.tagArray[0].toString();
        console.log("Retrieved data => ", data);
        //   expect(data).toBe("Tag1");
        // } 
    } else {
        console.log("No Records Found");
    }


    // expect (retrievedRecord.adUrl).toBe(CircuitString.fromString("Rand2"));


    // if (retrievedRecord) {
    //   const decryptedData = decrypt(
    //     retrievedRecord.encryptedData.toString(),
    //     encryptionKey
    //   );
    //   expect(decryptedData).toBe(originalData);
    //   expect(retrievedRecord.isDeleted).toEqual(Field(0));
    // }



    // // Update record
    // const updatedData = "Updated health information";
    // const updatedEncryptedData = encrypt(updatedData, encryptionKey);
    // tx = await appChain.transaction(alice, async () => {
    //   await healthRecords.storeOrUpdateRecord(
    //     alice,
    //     CircuitString.fromString(updatedEncryptedData)
    //   );
    // });
    // await tx.sign();
    // await tx.send();
    // await appChain.produceBlock();

    // // Retrieve and verify updated record
    // retrievedRecord =
    //   await appChain.query.runtime.HealthRecords.records.get(alice);
    // expect(retrievedRecord).toBeDefined();
    // if (retrievedRecord) {
    //   const decryptedData = decrypt(
    //     retrievedRecord.encryptedData.toString(),
    //     encryptionKey
    //   );
    //   expect(decryptedData).toBe(updatedData);
    //   expect(retrievedRecord.isDeleted).toEqual(Field(0));
    // }

    // // Delete record
    // tx = await appChain.transaction(alice, async () => {
    //   await healthRecords.deleteRecord(alice);
    // });
    // await tx.sign();
    // await tx.send();
    // await appChain.produceBlock();

    // // Verify record is marked as deleted
    // retrievedRecord =
    //   await appChain.query.runtime.Advertisements.records.get(CircuitString.fromString("Rand1"));
    // expect(retrievedRecord).toBeDefined();
    // if (retrievedRecord) {
    //   expect(retrievedRecord.isDeleted).toEqual(Field(1));
    // }
  });

  it("should get `undefined` when trying to retrieve a non-existent record", async () => {
    // const bobPrivateKey = PrivateKey.random();
    // const bob = bobPrivateKey.toPublicKey();

    expect(
      await appChain.query.runtime.Advertisements.records.get(CircuitString.fromString("R2"))
    ).toBeUndefined();
  });
});

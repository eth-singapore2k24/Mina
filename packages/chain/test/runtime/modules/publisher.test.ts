// import * as crypto from "node:crypto";
import { TestingAppChain } from "@proto-kit/sdk";
import { UInt64 } from "@proto-kit/library";
import { PrivateKey, CircuitString, Field } from "o1js";
import {
  Publish
} from "../../../src/runtime/modules/pub_trans";
import { Balances } from "../../../src/runtime/modules/balances";

describe("Publisher ", () => {
  let appChain: any;
  let pub: Publish;
  const alicePrivateKey = PrivateKey.random();
  const alice = alicePrivateKey.toPublicKey();
  // const encryptionKey = crypto.randomBytes(32).toString("hex"); // 256-bit key

  beforeAll(async () => {
    appChain = TestingAppChain.fromRuntime({
      Balances,
      Publish,
    });

    appChain.configurePartial({
      Runtime: {
        Balances: {
          totalSupply: UInt64.from(10000),
        },
        Advertisements: {},
        Publish: {},
        // AccessControl: {},
        // SharingPermissions: {},
      },
    });
    await appChain.start();

    appChain.setSigner(alicePrivateKey);
    pub = appChain.runtime.resolve("Publish");
  });

  it("should store, retrieve, update, and delete a Publisher record", async () => {
    // const originalData = "Confidential health information";
    // const encryptedData = encrypt(originalData, encryptionKey);
    
    // Store record
    let tx = await appChain.transaction(alice, async () => {
      // Store Record corresponding Tag "Tag1" corrsponding to PUBLICKEY Alice
      await pub.storeOrUpdateRecord(
        alice,
        CircuitString.fromString("Tag1")
      );
      // Store Record corresponding Tag "Tag2" corrsponding to PUBLICKEY Alice
      await pub.storeOrUpdateRecord(
        alice,
        CircuitString.fromString("Tag2")
      );

      // // Store Record corresponding Tag "Tag3" corrsponding to PUBLICKEY Alice
      // await pub.storeOrUpdateRecord(
      //   alice,
      //   CircuitString.fromString("Tag3")
      // );

      // // Store Record corresponding Tag "Tag4" corrsponding to PUBLICKEY Alice
      // await pub.storeOrUpdateRecord(
      //   alice,
      //   CircuitString.fromString("Tag4")
      // );
    });
    await tx.sign();
    await tx.send();
    await appChain.produceBlock();

    // Retrieve and verify record
    const publishInstance = new Publish();
    // let retrievedRecordCount = await publishInstance.getTotalRecords(alice);

    const retrievedRecordCount = await appChain.query.runtime.Publish.totalRecord.get(alice);
    console.log((retrievedRecordCount.value));
    const retrievedRecord = await appChain.query.runtime.Publish.records.get(alice);
    // const retrievedRecord = await pub.getRecord(alice);
    console.log(retrievedRecord.toString());
   
    // ---------------- 2nd Test ----------------------------------------------
        // Store record
    let tx2 = await appChain.transaction(alice, async () => {
      // Store Record corresponding Tag "Tag1" corrsponding to PUBLICKEY Alice
      // await pub.storeOrUpdateRecord(
      //   alice,
      //   CircuitString.fromString("Tag1")
      // );
      // // Store Record corresponding Tag "Tag2" corrsponding to PUBLICKEY Alice
      // await pub.storeOrUpdateRecord(
      //   alice,
      //   CircuitString.fromString("Tag2")
      // );

      // Store Record corresponding Tag "Tag3" corrsponding to PUBLICKEY Alice
      await pub.storeOrUpdateRecord(
        alice,
        CircuitString.fromString("Tag3")
      );

      // Store Record corresponding Tag "Tag4" corrsponding to PUBLICKEY Alice
      await pub.storeOrUpdateRecord(
        alice,
        CircuitString.fromString("Tag4")
      );
    });
    await tx2.sign();
    await tx2.send();
    await appChain.produceBlock();

    // Retrieve and verify record

    const retrievedRecordCount2 = await appChain.query.runtime.Publish.totalRecord.get(alice);
    console.log((retrievedRecordCount2.value));
    const retrievedRecord2 = await appChain.query.runtime.Publish.records.get(alice).value;
    // const retrievedRecord = await pub.getRecord(alice);
    console.log(retrievedRecord2);
   

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

//   it("should get `undefined` when trying to retrieve a non-existent record", async () => {
//     // const bobPrivateKey = PrivateKey.random();
//     // const bob = bobPrivateKey.toPublicKey();

//     await expect(
//       await appChain.query.runtime.Publish.records.get(CircuitString.fromString("R2"))
//     ).toBeUndefined();
//   });
});

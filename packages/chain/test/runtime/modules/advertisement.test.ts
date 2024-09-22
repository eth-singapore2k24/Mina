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
import { Balances } from "../../../src/runtime/modules/balances";

describe("Advertisements", () => {
  let appChain: any;
  let adv: Advertisements;
  const alicePrivateKey = PrivateKey.random();
  const alice = alicePrivateKey.toPublicKey();
  // const encryptionKey = crypto.randomBytes(32).toString("hex"); // 256-bit key

  beforeAll(async () => {
    appChain = TestingAppChain.fromRuntime({
      Balances,
      Advertisements,
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
    adv = appChain.runtime.resolve("Advertisements");
  });

  it("should store, retrieve, update, and delete a advertisements record", async () => {
    // const originalData = "Confidential health information";
    // const encryptedData = encrypt(originalData, encryptionKey);
    
    // Store record
    let tx = await appChain.transaction(alice, async () => {
      await adv.storeOrUpdateRecord(
        CircuitString.fromString("Rand1"),
        CircuitString.fromString("Rand2"),
        CircuitString.fromString("Rand3")
      );
    });
    await tx.sign();
    await tx.send();
    await appChain.produceBlock();

    // Retrieve and verify record
    let retrievedRecord =
      await appChain.query.runtime.Advertisements.records.get(CircuitString.fromString("Rand1"));
    expect(retrievedRecord).toBeDefined();
    if (retrievedRecord) {
      let data = retrievedRecord.adURL.toString();
      expect(data).toBe("Rand2");
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

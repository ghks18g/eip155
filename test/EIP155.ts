import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ethers, expect, config } from "hardhat";

import { BigNumber, providers } from "ethers";

/**
 * BSC 는 EIP 1559 를 준수하지 않음
 */
describe("EIP155", async () => {
  // let operator: SignerWithAddress;
  // let receiver: SignerWithAddress;
  // let operatorAddress: string;
  // let nativeBalance: BigNumber;
  // let eip1559Receipt: providers.TransactionReceipt;
  // let lagacyReceipt: providers.TransactionReceipt;
  // before(async () => {
  //   [operator, receiver] = await ethers.getSigners();

  //   operatorAddress = operator.address;
  //   nativeBalance = await operator.getBalance();
  //   console.log("operatorAddress: ", operatorAddress);
  //   console.log("balance: ", nativeBalance);
  //   console.log("receiver: ", receiver.address);
  //   console.log("balance: ", await receiver.getBalance());
  // });

  // it("create native transfer transaction ( type 1 )", async () => {
  //   try {
  //     const nativeTransferTx = await operator.sendTransaction({
  //       to: receiver.address,
  //       value: ethers.utils.parseEther("100"),
  //     });

  //     eip1559Receipt = await nativeTransferTx.wait();

  //     expect(eip1559Receipt.type).to.equal(2);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // });

  // it("create native transfer transaction ( type 2 / lagacy )", async () => {
  //   try {
  //     const nativeTransferTx = await operator.sendTransaction({
  //       to: receiver.address,
  //       value: ethers.utils.parseEther("100"),
  //       gasPrice: await operator.provider?.getGasPrice(),
  //     });

  //     lagacyReceipt = await nativeTransferTx.wait();

  //     expect(lagacyReceipt.type).to.equal(0);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // });

  // after(() => {
  //   console.log("eip1559: \n", eip1559Receipt);
  //   console.log("lagacy: \n", lagacyReceipt);
  // });
});

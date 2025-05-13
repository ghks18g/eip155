import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ethers, expect, config } from "hardhat";

import { BigNumber, Transaction, Wallet, providers } from "ethers";

interface HardhatNetworkConfig {
  url: string;
  chainId: number;
  accounts: string[];
}

/**
 * BSC 는 EIP 1559 를 준수하지 않음
 */
describe("EIP155 ", async () => {
  let operator: Wallet;

  let bscEoA: Wallet;
  let chainId: number;
  let operatorAddress: string;
  let nativeBalance: BigNumber;
  let eip1559Receipt: providers.TransactionReceipt;
  let lagacyReceipt: providers.TransactionReceipt;
  let bscRPCProvider: providers.JsonRpcProvider;
  let sepoliaRPCProvider: providers.JsonRpcProvider;
  let bscChainId: number;

  before(async () => {
    // [operator, receiver] = await ethers.getSigners();

    const operatorKey = (config.networks?.sepolia as HardhatNetworkConfig)
      ?.accounts[0];
    const sepoliaRpcUrl = (config.networks?.sepolia as HardhatNetworkConfig)
      .url;

    sepoliaRPCProvider = new ethers.providers.JsonRpcProvider(sepoliaRpcUrl);

    operator = new ethers.Wallet(operatorKey, sepoliaRPCProvider);

    console.log("operator:", operator);

    const bscTestnetRpcUrl = (
      config.networks?.bscTestnet as HardhatNetworkConfig
    ).url;

    console.log(`bscTestnetRpcUrl: `, bscTestnetRpcUrl);

    operatorAddress = await operator.getAddress();
    console.log("operatorAddress: ", operatorAddress);
    nativeBalance = await sepoliaRPCProvider.getBalance(operatorAddress);
    console.log("balance: ", nativeBalance);
    chainId = await operator.getChainId();
    console.log(`chainId: `, chainId);

    bscRPCProvider = new ethers.providers.JsonRpcProvider(bscTestnetRpcUrl);

    bscEoA = ethers.Wallet.createRandom().connect(bscRPCProvider);

    bscChainId = await bscEoA.getChainId();
    console.log(`bscChainId: `, bscChainId);
    console.log("bscEoA: ", bscEoA.address);
    console.log("balance: ", await bscEoA.getBalance());

    console.log(
      "------------------------- END OF BEFORE -------------------------",
    );
  });

  it("EIP 155 Transaction ", async () => {
    //
    const operatorNonce = await operator.getTransactionCount();

    console.log(`operatorNonce: `, operatorNonce);
    const estimatedGas = await operator.estimateGas({
      to: bscEoA.address,
      value: ethers.utils.parseEther("0.1"),
      chainId,
      nonce: operatorNonce,
    });

    console.log(`estimatedGas: `, estimatedGas);
    const originTx: providers.TransactionRequest = {
      to: bscEoA.address,
      value: ethers.utils.parseEther("0.1"),
      chainId,
      nonce: operatorNonce,
      gasLimit: estimatedGas,
      data: ethers.utils.toUtf8Bytes(""),
    };

    console.log("originTx:\n", originTx);
    const signedTx = await operator.signTransaction(originTx);

    const originTxObejct = ethers.utils.parseTransaction(signedTx);

    console.log("originTxObejct:\n", originTxObejct);

    const expected = chainId * 2 + 35;
    const expected2 = chainId * 2 + 36;

    console.log("expected: ", expected);
    console.log("expected2: ", expected2);
    expect(originTxObejct.v).to.be.oneOf([expected, expected2]);
  });

  it("Lagacy Transaction ", async () => {
    //
    const operatorNonce = await operator.getTransactionCount();

    console.log(`operatorNonce: `, operatorNonce);
    const estimatedGas = await operator.estimateGas({
      to: bscEoA.address,
      value: ethers.utils.parseEther("0.1"),
      nonce: operatorNonce,
    });

    console.log(`estimatedGas: `, estimatedGas);
    const originTx: providers.TransactionRequest = {
      to: bscEoA.address,
      value: ethers.utils.parseEther("0.1"),
      nonce: operatorNonce,
      gasLimit: estimatedGas,
      data: ethers.utils.toUtf8Bytes(""),
    };

    console.log("originTx:\n", originTx);
    const signedTx = await operator.signTransaction(originTx);

    const originTxObejct = ethers.utils.parseTransaction(signedTx);

    console.log("originTxObejct:\n", originTxObejct);

    const expected = 27;
    const expected2 = 28;

    console.log("expected: ", expected);
    console.log("expected2: ", expected2);
    expect(originTxObejct.v).to.be.oneOf([expected, expected2]);
  });

  after(() => {});
});

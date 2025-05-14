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
  let eip155Tx: Transaction;
  let lagacyTx: Transaction;
  let bscRPCProvider: providers.JsonRpcProvider;
  let sepoliaRPCProvider: providers.JsonRpcProvider;
  let bscChainId: number;
  let eip155_v_values: number[];
  let lagacy_v_values: number[];

  before(async () => {
    // [operator, receiver] = await ethers.getSigners();

    const operatorKey = (config.networks?.sepolia as HardhatNetworkConfig)
      ?.accounts[0];

    const bscTestnetRpcUrl = (
      config.networks?.bscTestnet as HardhatNetworkConfig
    ).url;
    bscRPCProvider = new ethers.providers.JsonRpcProvider(bscTestnetRpcUrl);
    console.log(`bscTestnetRpcUrl: `, bscTestnetRpcUrl);

    operator = new ethers.Wallet(operatorKey, bscRPCProvider);

    operatorAddress = await operator.getAddress();
    console.log("operatorAddress: ", operatorAddress);
    nativeBalance = await operator.getBalance();
    console.log("balance: ", nativeBalance);
    chainId = await operator.getChainId();
    console.log(`chainId: `, chainId);

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

    const estimatedGas = await operator.estimateGas({
      to: bscEoA.address,
      value: ethers.utils.parseEther("0.1"),
      chainId,
      nonce: operatorNonce,
    });

    const originTx: providers.TransactionRequest = {
      to: bscEoA.address,
      value: ethers.utils.parseEther("0.1"),
      chainId,
      nonce: operatorNonce,
      gasLimit: estimatedGas,
      data: ethers.utils.toUtf8Bytes(""),
    };

    const signedTx = await operator.signTransaction(originTx);

    eip155Tx = ethers.utils.parseTransaction(signedTx);

    const expected = chainId * 2 + 35;
    const expected2 = chainId * 2 + 36;
    eip155_v_values = [expected, expected2];

    expect(eip155Tx.v).to.be.oneOf([expected, expected2]);
  });

  it("Lagacy Transaction ", async () => {
    //
    const operatorNonce = await operator.getTransactionCount();

    const estimatedGas = await operator.estimateGas({
      to: bscEoA.address,
      value: ethers.utils.parseEther("0.1"),
      nonce: operatorNonce,
    });

    const originTx: providers.TransactionRequest = {
      to: bscEoA.address,
      value: ethers.utils.parseEther("0.1"),
      nonce: operatorNonce,
      gasLimit: estimatedGas,
      data: ethers.utils.toUtf8Bytes(""),
    };

    const signedTx = await operator.signTransaction(originTx);

    lagacyTx = ethers.utils.parseTransaction(signedTx);

    const expected = 27;
    const expected2 = 28;
    lagacy_v_values = [expected, expected2];
    expect(lagacyTx.v).to.be.oneOf([expected, expected2]);
  });

  after(() => {
    console.log(`EIP 155 Tx : \n`, eip155Tx);
    console.log(`EIP 155 V : `, eip155_v_values);

    console.log(`Lagacy V : \n`, lagacyTx);
    console.log(`Lagacy V : \n`, lagacy_v_values);
  });
});

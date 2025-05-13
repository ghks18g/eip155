import hre, { ethers, network } from "hardhat";
import { prompt } from "prompts";

(async () => {
  // MARK: Signer Info
  const [operator] = await ethers.getSigners();

  const [address, balance] = await Promise.all([
    operator.getAddress(),
    operator.getBalance(),
  ]);
})();

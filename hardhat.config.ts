import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-truffle5";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";

dotenv.config();

const config: HardhatUserConfig = {
  // solidity: "0.8.28",
  solidity: {
    compilers: [
      {
        version: "0.8.22",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "london",
        },
      },
    ],
  },
  networks: {
    hardhat: {
      accounts: { count: 1000 },
    },
    sepolia: {
      chainId: 11155111,
      url: `https://weathered-necessary-needle.ethereum-sepolia.quiknode.pro/1390196a64684bfaa3842b72a6bed8d09ab745ab/`,
      accounts: [process.env.OPERATOR_KEY || ""],
    },
    bscTestnet: {
      chainId: 97,
      url: `https://quiet-snowy-meme.bsc-testnet.quiknode.pro/fef9d6af79636a0227dc45c078a28c304348fed9/`,
      accounts: [process.env.OPERATOR_KEY || ""],
    },
    avalancheFuji: {
      chainId: 43113,
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [process.env.OPERATOR_KEY || ""],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "",
          browserURL: "https://testnet.etherscan.io/",
        },
      },
      {
        network: "bscTestnet",
        chainId: 97,
        urls: {
          apiURL: "",
          browserURL: "https://testnet.bscscan.com/",
        },
      },
      {
        network: "avalancheFuji",
        chainId: 43113,
        urls: {
          apiURL: "",
          browserURL: "https://testnet.avascan.info/",
        },
      },
    ],
  },
};

export default config;

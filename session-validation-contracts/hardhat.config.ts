import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  networks: {
    base_test: {
      url: process.env.BASE_TESTNET_RPC || "",
      accounts:
        process.env.TESTNET_DEPLOYER !== undefined
          ? [process.env.TESTNET_DEPLOYER]
          : [],
      timeout: 900000,
      chainId: 84532,
    },
  },

  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  gasReporter: {
    enabled: true,
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },

  etherscan: {
    apiKey: process.env.BASE_API_KEY,
  },
};

export default config;

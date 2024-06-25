import { ethers } from "hardhat";
import {
  WhiteListSessionValidationModule,
  WhiteListSessionValidationModule__factory,
} from "../typechain-types";

async function main() {
  const provider = ethers.provider;
  const [Deployer] = await ethers.getSigners();

  console.log("Deployer account:", Deployer.address);
  console.log(
    "Account balance:",
    (await provider.getBalance(Deployer.address)).toString()
  );

  console.log("\n===== Deploy Whitelist Module Contract =====");
  const Module = (await ethers.getContractFactory(
    "WhiteListSessionValidationModule",
    Deployer
  )) as WhiteListSessionValidationModule__factory;
  const module: WhiteListSessionValidationModule = await Module.deploy(
    Deployer.address,
    []
  );
  console.log("Tx Hash: %s", module.deploymentTransaction()?.hash);
  await module.deploymentTransaction()?.wait();

  console.log("Whitelist Module Contract: ", await module.getAddress());

  console.log("\n===== DONE =====");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

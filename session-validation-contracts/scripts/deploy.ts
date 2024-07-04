import { ethers } from "hardhat";
import {
  SessionValidation,
  SessionValidation__factory,
  MockNFT,
  MockNFT__factory,
} from "../typechain-types";

async function main() {
  const provider = ethers.provider;
  const [Deployer] = await ethers.getSigners();

  console.log("Deployer account:", Deployer.address);
  console.log(
    "Account balance:",
    (await provider.getBalance(Deployer.address)).toString(),
  );

  console.log("\n===== Deploy Whitelist Module Contract =====");
  const Module = (await ethers.getContractFactory(
    "SessionValidation",
    Deployer,
  )) as SessionValidation__factory;
  const sessionModule: SessionValidation = await Module.deploy(
    Deployer.address,
    [],
  );
  console.log("Tx Hash: %s", sessionModule.deploymentTransaction()?.hash);
  await sessionModule.deploymentTransaction()?.wait();

  console.log("Whitelist Module Contract: ", await sessionModule.getAddress());

  console.log("\n===== Deploy Mock NFT Contract =====");
  const NFT = (await ethers.getContractFactory(
    "MockNFT",
    Deployer,
  )) as MockNFT__factory;
  const nft: MockNFT = await NFT.deploy();
  console.log("Tx Hash: %s", nft.deploymentTransaction()?.hash);
  await nft.deploymentTransaction()?.wait();

  console.log("Mock NFT Contract: ", await nft.getAddress());

  console.log("\n===== Add Mock NFT to Whitelist =====");
  const tx = await sessionModule.whitelist(await nft.getAddress(), true);
  console.log("Tx Hash: ", tx.hash);
  await tx.wait();

  console.log("\n===== DONE =====");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

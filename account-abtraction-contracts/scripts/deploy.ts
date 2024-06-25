import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import { ethers } from "hardhat";

async function main() {
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, ethers.provider);
  console.log("Deploying contracts with the account:", signer.address);
  const whitelistSessionValidationModule = await ethers.deployContract("WhiteListSessionValidationModule", [
    signer.address,
    [],
  ], {
    signer: signer,
  });

  await whitelistSessionValidationModule.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

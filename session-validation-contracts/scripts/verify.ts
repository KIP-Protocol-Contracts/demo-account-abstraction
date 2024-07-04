import hre from "hardhat";

async function main() {
  console.log("Verify Validation Module Contract ......");
  const Module = "";    //  replace by your deployed `SessionValidation` contract
  const initialOwner = "";   // replace by your `owner` address
  const addresses: string[] = [];

  await hre.run("verify:verify", {
    address: Module,
    constructorArguments: [initialOwner, addresses],
  });

  console.log("Verify Mock NFT Contract ......");
  const NFT = "";   //  replace by your deployed `MockNFT` contract

  await hre.run("verify:verify", {
    address: NFT,
    constructorArguments: [],
  });

  console.log("\n===== DONE =====");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

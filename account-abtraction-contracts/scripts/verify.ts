import hre from "hardhat";

async function main() {
  console.log("Verify Validation Module Contract ......");
  const Module = "";
  const initialOwner = "";
  const addresses: string[] = [];

  await hre.run("verify:verify", {
    address: Module,
    constructorArguments: [initialOwner, addresses],
  });

  console.log("\n===== DONE =====");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

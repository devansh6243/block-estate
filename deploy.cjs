const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Marketplace = await hre.ethers.getContractFactory("RealEstateMarketplace");
  const marketplace = await Marketplace.deploy();

  await marketplace.waitForDeployment();
  const address = await marketplace.getAddress();

  console.log("Marketplace deployed to:", address);

  // Save the contract's artifact and address to the frontend directory
  saveFrontendFiles(address);
}

function saveFrontendFiles(contractAddress) {
  const contractsDir = path.join(__dirname, "..", "src", "lib", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ RealEstateMarketplace: contractAddress }, undefined, 2)
  );

  const MarketplaceArtifact = hre.artifacts.readArtifactSync("RealEstateMarketplace");

  fs.writeFileSync(
    path.join(contractsDir, "RealEstateMarketplace.json"),
    JSON.stringify(MarketplaceArtifact, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers } from "hardhat";
import { parseUnits } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying to BNB Testnet with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "tBNB");

  // Deploy ReserveManager
  console.log("\nDeploying ReserveManager...");
  const ReserveManager = await ethers.getContractFactory("ReserveManager");
  const reserveManager = await ReserveManager.deploy();
  await reserveManager.waitForDeployment();
  const addr = await reserveManager.getAddress();
  console.log("ReserveManager deployed to:", addr);

  // Write reserves
  console.log("\nWriting reserves...");
  const totalMinted = parseUnits("500000", 18);
  const totalReserve = parseUnits("600000", 18);
  const tx = await reserveManager.updateReserves({ totalMinted, totalReserve });
  const receipt = await tx.wait();
  console.log("TX hash:", receipt?.hash);

  // Read back
  const storedMinted = await reserveManager.lastTotalMinted();
  const storedReserve = await reserveManager.lastTotalReserve();
  console.log("Read - lastTotalMinted:", storedMinted.toString());
  console.log("Read - lastTotalReserve:", storedReserve.toString());

  console.log(`\nView on explorer: https://testnet.bscscan.com/address/${addr}`);
  console.log("\n✅ Done!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

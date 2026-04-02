import { ethers } from "hardhat";
import { parseUnits } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying to BNB Testnet with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "tBNB");

  if (balance === 0n) {
    console.error("❌ No tBNB balance! Get testnet BNB from https://www.bnbchain.org/en/testnet-faucet");
    process.exit(1);
  }

  // Deploy ReserveManager
  console.log("\nDeploying ReserveManager...");
  const ReserveManager = await ethers.getContractFactory("ReserveManager");
  const reserveManager = await ReserveManager.deploy();
  await reserveManager.waitForDeployment();
  const reserveManagerAddr = await reserveManager.getAddress();
  console.log("ReserveManager deployed to:", reserveManagerAddr);

  // Deploy MessageEmitter
  console.log("Deploying MessageEmitter...");
  const MessageEmitter = await ethers.getContractFactory("MessageEmitter");
  const messageEmitter = await MessageEmitter.deploy();
  await messageEmitter.waitForDeployment();
  const messageEmitterAddr = await messageEmitter.getAddress();
  console.log("MessageEmitter deployed to:", messageEmitterAddr);

  // Deploy SimpleERC20
  console.log("Deploying SimpleERC20...");
  const SimpleERC20 = await ethers.getContractFactory("SimpleERC20");
  const token = await SimpleERC20.deploy("TestToken", "TT", parseUnits("1000000", 18));
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("SimpleERC20 deployed to:", tokenAddr);

  // Deploy BalanceReader
  console.log("Deploying BalanceReader...");
  const BalanceReader = await ethers.getContractFactory("BalanceReader");
  const balanceReader = await BalanceReader.deploy();
  await balanceReader.waitForDeployment();
  const balanceReaderAddr = await balanceReader.getAddress();
  console.log("BalanceReader deployed to:", balanceReaderAddr);

  // --- Write to ReserveManager ---
  console.log("\n--- Writing to ReserveManager ---");
  const totalMinted = parseUnits("500000", 18);
  const totalReserve = parseUnits("600000", 18);
  console.log("  totalMinted:", totalMinted.toString());
  console.log("  totalReserve:", totalReserve.toString());

  const tx = await reserveManager.updateReserves({ totalMinted, totalReserve });
  const receipt = await tx.wait();
  console.log("TX hash:", receipt?.hash);

  // --- Read back ---
  const storedMinted = await reserveManager.lastTotalMinted();
  const storedReserve = await reserveManager.lastTotalReserve();
  console.log("Read - lastTotalMinted:", storedMinted.toString());
  console.log("Read - lastTotalReserve:", storedReserve.toString());

  // --- Summary ---
  console.log("\n=== Deployed Contract Addresses (BNB Testnet) ===");
  console.log(`ReserveManager:  ${reserveManagerAddr}`);
  console.log(`MessageEmitter:  ${messageEmitterAddr}`);
  console.log(`SimpleERC20:     ${tokenAddr}`);
  console.log(`BalanceReader:   ${balanceReaderAddr}`);
  console.log(`\nView on explorer: https://testnet.bscscan.com/address/${reserveManagerAddr}`);

  console.log("\n✅ BNB Testnet deployment and write completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

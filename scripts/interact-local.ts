import { ethers } from "hardhat";
import { parseUnits } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Get deployed contract addresses from Ignition artifacts
  const deployments = require("../ignition/deployments/chain-31337/deployed_addresses.json");

  const reserveManagerAddr = deployments["DeployModule#ReserveManager"];
  const messageEmitterAddr = deployments["DeployModule#MessageEmitter"];
  const simpleERC20Addr = deployments["DeployModule#SimpleERC20"];
  const balanceReaderAddr = deployments["DeployModule#BalanceReader"];

  console.log("\n--- Contract Addresses ---");
  console.log("ReserveManager:", reserveManagerAddr);
  console.log("MessageEmitter:", messageEmitterAddr);
  console.log("SimpleERC20:", simpleERC20Addr);
  console.log("BalanceReader:", balanceReaderAddr);

  // --- ReserveManager: Write and Read ---
  console.log("\n--- ReserveManager ---");
  const reserveManager = await ethers.getContractAt("ReserveManager", reserveManagerAddr);

  const totalMinted = parseUnits("500000", 18);
  const totalReserve = parseUnits("600000", 18);

  console.log("Writing reserves...");
  console.log("  totalMinted:", totalMinted.toString());
  console.log("  totalReserve:", totalReserve.toString());

  const tx = await reserveManager.updateReserves({
    totalMinted,
    totalReserve,
  });
  const receipt = await tx.wait();
  console.log("Transaction hash:", receipt?.hash);

  const storedMinted = await reserveManager.lastTotalMinted();
  const storedReserve = await reserveManager.lastTotalReserve();
  console.log("Read back - lastTotalMinted:", storedMinted.toString());
  console.log("Read back - lastTotalReserve:", storedReserve.toString());

  // --- MessageEmitter: Emit and Read ---
  console.log("\n--- MessageEmitter ---");
  const messageEmitter = await ethers.getContractAt("MessageEmitter", messageEmitterAddr);

  const message = "Hello from Hardhat local!";
  console.log("Emitting message:", message);
  const tx2 = await messageEmitter.emitMessage(message);
  await tx2.wait();

  const lastMsg = await messageEmitter.getLastMessage(deployer.address);
  console.log("Read back - lastMessage:", lastMsg);

  // --- SimpleERC20: Check balance ---
  console.log("\n--- SimpleERC20 ---");
  const token = await ethers.getContractAt("SimpleERC20", simpleERC20Addr);
  const balance = await token.balanceOf(deployer.address);
  const totalSupply = await token.totalSupply();
  console.log("Deployer balance:", ethers.formatUnits(balance, 18));
  console.log("Total supply:", ethers.formatUnits(totalSupply, 18));

  // --- BalanceReader: Read native balances ---
  console.log("\n--- BalanceReader ---");
  const balanceReader = await ethers.getContractAt("BalanceReader", balanceReaderAddr);
  const nativeBalances = await balanceReader.getNativeBalances([deployer.address]);
  console.log("Native balance of deployer:", ethers.formatEther(nativeBalances[0]));

  console.log("\n✅ All local interactions completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

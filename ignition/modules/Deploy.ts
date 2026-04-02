import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseUnits } from "ethers";

const DeployModule = buildModule("DeployModule", (m) => {
  // Deploy ReserveManager
  const reserveManager = m.contract("ReserveManager");

  // Deploy MessageEmitter
  const messageEmitter = m.contract("MessageEmitter");

  // Deploy SimpleERC20 (mock token with 1M supply)
  const simpleERC20 = m.contract("SimpleERC20", [
    "TestToken",
    "TT",
    parseUnits("1000000", 18),
  ]);

  // Deploy BalanceReader
  const balanceReader = m.contract("BalanceReader");

  // Deploy UpdateReservesProxySimplified
  // Using deployer as expected author and a placeholder workflow name
  const deployer = m.getAccount(0);
  const updateReservesProxy = m.contract("UpdateReservesProxySimplified", [
    reserveManager,
    deployer,
    "0x706f722d776f726b0000", // "por-work" as bytes10 (10 bytes = 20 hex chars)
  ]);

  return {
    reserveManager,
    messageEmitter,
    simpleERC20,
    balanceReader,
    updateReservesProxy,
  };
});

export default DeployModule;

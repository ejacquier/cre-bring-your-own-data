<div style="text-align:center" align="center">
    <a href="https://chain.link" target="_blank">
        <img src="https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/docs/logo-chainlink-blue.svg" width="225" alt="Chainlink logo">
    </a>

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![CRE Home](https://img.shields.io/static/v1?label=CRE&message=Home&color=blue)](https://chain.link/chainlink-runtime-environment)
[![CRE Documentation](https://img.shields.io/static/v1?label=CRE&message=Docs&color=blue)](https://docs.chain.link/cre)

</div>

# Custom Data Feed – CRE Template (TypeScript)

A template for bringing your own **custom off-chain data feed** on-chain with the **Chainlink Runtime Environment (CRE)** using **TypeScript** and **Bun**.

---

**⚠️ DISCLAIMER**

This template is an educational example to demonstrate how to interact with Chainlink systems, products, and services. It is provided **“AS IS”** and **“AS AVAILABLE”** without warranties of any kind, has **not** been audited, and may omit checks or error handling for clarity. **Do not use this code in production** without performing your own audits and applying best practices. Neither Chainlink Labs, the Chainlink Foundation, nor Chainlink node operators are responsible for unintended outputs generated due to errors in code.

---

## Table of Contents

* [What This Template Does](#what-this-template-does)
* [Getting Started](#getting-started)
  * [1. Update .env file](#1-update-env-file)
  * [2. Install dependencies](#2-install-dependencies)
  * [3. Configure RPC endpoints](#3-configure-rpc-endpoints)
  * [4. Deploy contracts](#4-deploy-contracts)
  * [5. Configure workflow](#5-configure-workflow)
  * [6. Simulate the workflow](#6-simulate-the-workflow)
* [Local Development with Hardhat](#local-development-with-hardhat)
  * [Prerequisites](#prerequisites)
  * [1. Start the Hardhat node](#1-start-the-hardhat-node)
  * [2. Deploy contracts to local node](#2-deploy-contracts-to-local-node)
  * [3. Update local config with deployed addresses](#3-update-local-config-with-deployed-addresses)
  * [4. Simulate with broadcast](#4-simulate-with-broadcast)
  * [Deploying to BNB Testnet](#deploying-to-bnb-testnet)
* [Security Considerations](#security-considerations)
* [License](#license)

---

## What This Template Does

This template provides an end-to-end starting point for bringing your own **custom data feed** on-chain with the **Chainlink Runtime Environment (CRE)**. It showcases local simulation and the core CRE workflow patterns.

**Components:**
- **Contracts** (Solidity) under `projectRoot/contracts/evm/src`  
  Example demo contracts used by the workflow:
  - `ReserveManager`
  - `SimpleERC20`
  - `BalanceReader`
  - `MessageEmitter`
- **CRE Workflow** (**TypeScript**) that fetches your off-chain data and optionally performs chain writes based on configurable triggers (cron or EVM log). The entry point is typically `main.ts`.

**Key Technologies**
- **CRE (Chainlink Runtime Environment)** – orchestrates workflows with DON consensus.
- **TypeScript + Bun** – authoring and running the workflow locally.

---

## Getting Started

### 1. Update .env file

You need to add a private key to the `.env` file. This is specifically required if you want to simulate **chain writes** (the key must be valid and funded).  
If your workflow does **not** write on-chain, you can keep a dummy key:

```bash
CRE_ETH_PRIVATE_KEY=0000000000000000000000000000000000000000000000000000000000000001
````

### 2. Install dependencies

If **Bun** is not already installed, follow the instructions at: [https://bun.com/docs/installation](https://bun.com/docs/installation)

From your project root, run:

```bash
bun install --cwd ./my-workflow
```

### 3. Configure RPC endpoints

For local simulation to interact with a chain, specify RPC endpoints for the chains you interact with in `project.yaml`. This is required for submitting transactions and reading blockchain state.

Supported for local simulation (testnet/mainnet variants):

* Ethereum (`ethereum-testnet-sepolia`, `ethereum-mainnet`)
* Base (`ethereum-testnet-sepolia-base-1`, `ethereum-mainnet-base-1`)
* Avalanche (`avalanche-testnet-fuji`, `avalanche-mainnet`)
* Polygon (`polygon-testnet-amoy`, `polygon-mainnet`)
* BNB Chain (`binance-smart-chain-testnet`, `binance-smart-chain-mainnet`)
* Arbitrum (`ethereum-testnet-sepolia-arbitrum-1`, `ethereum-mainnet-arbitrum-1`)
* Optimism (`ethereum-testnet-sepolia-optimism-1`, `ethereum-mainnet-optimism-1`)

Add your RPCs under `rpcs` (example):

```yaml
rpcs:
  - chain-name: ethereum-testnet-sepolia
    url: <Your RPC endpoint to ETH Sepolia>
```

> For chain names, see the selectors list:
> [https://github.com/smartcontractkit/chain-selectors/blob/main/selectors.yml](https://github.com/smartcontractkit/chain-selectors/blob/main/selectors.yml)

### 4. Deploy contracts

Deploy the demo contracts: **BalanceReader**, **MessageEmitter**, **ReserveManager**, **SimpleERC20**.
You can deploy to a local chain or a testnet using tools like Foundry.

For a quick start, you can also use the pre-deployed contract addresses on Ethereum Sepolia—no action required if you’re just trying things out.

### 5. Configure workflow

Configure `config.json` for the workflow:

* `schedule`: e.g. `"*/30 * * * * *"` (every 30 seconds), or any cron you prefer
* `url`: your off-chain data endpoint (custom data feed)
* `tokenAddress`: `SimpleERC20` contract address
* `porAddress`: `ReserveManager` contract address
* `proxyAddress`: `UpdateReservesProxySimplified` contract address
* `balanceReaderAddress`: `BalanceReader` contract address
* `messageEmitterAddress`: `MessageEmitter` contract address
* `chainSelectorName`: human-readable chain name (see selectors YAML linked above)
* `gasLimit`: gas limit used for chain writes

Ensure `workflow.yaml` points to the config (example):

```yaml
staging-settings:
  user-workflow:
    workflow-name: "my-workflow"
  workflow-artifacts:
    workflow-path: "./main.ts"
    config-path: "./config.json"
    secrets-path: ""
```

### 6. Simulate the workflow

Run the command from the **project root** and pass the **path to the workflow directory**:

```bash
cre workflow simulate <path-to-workflow-directory>
```

Example (for `my-workflow`):

```bash
cre workflow simulate my-workflow
```

You’ll see trigger options similar to:

```
🚀 Workflow simulation ready. Please select a trigger:
1. cron-trigger@1.0.0 Trigger
2. evm:ChainSelector:16015286601757825753@1.0.0 LogTrigger
```

* **Cron Trigger**: choose `1` → the workflow executes on the schedule.
* **Log Trigger**: choose `2`, then provide the example inputs:

```
Transaction Hash: 0x420721d7d00130a03c5b525b2dbfd42550906ddb3075e8377f9bb5d1a5992f8e
Log Event Index: 0
```

Example output:

```
🔗 EVM Trigger Configuration:
Please provide the transaction hash and event index for the EVM log event.
Enter transaction hash (0x...): 0x420721d7d00130a03c5b525b2dbfd42550906ddb3075e8377f9bb5d1a5992f8e
Enter event index (0-based): 0
Fetching transaction receipt for transaction 0x420721d7d00130a03c5b525b2dbfd42550906ddb3075e8377f9bb5d1a5992f8e...
Found log event at index 0: contract=0x1d598672486ecB50685Da5497390571Ac4E93FDc, topics=3
Created EVM trigger log for transaction 0x420721d7d00130a03c5b525b2dbfd42550906ddb3075e8377f9bb5d1a5992f8e, event 0
```

---

## Local Development with Hardhat

This project includes a Hardhat setup that lets you deploy the template contracts to a local node and simulate the CRE workflow against it with `--broadcast`. This is useful for testing chain writes end-to-end without spending testnet gas.

### Prerequisites

Install Hardhat dependencies from the **project root** (one level above `cre/`):

```bash
cd /path/to/cre-por-template-hardhat
npm install
```

Compile the Solidity contracts:

```bash
npx hardhat compile
```

### 1. Start the Hardhat node

Open a terminal and start the local Hardhat node. Keep this terminal running:

```bash
npx hardhat node
```

This starts a local Ethereum node at `http://127.0.0.1:8545` with 20 pre-funded accounts (10,000 ETH each).

### 2. Deploy contracts to local node

In a **second terminal**, deploy all contracts using Hardhat Ignition:

```bash
npx hardhat ignition deploy ignition/modules/Deploy.ts --network localhost
```

You'll see output like:

```
Deployed Addresses

DeployModule#BalanceReader - 0x5FbDB2315678afecb367f032d93F642f64180aa3
DeployModule#MessageEmitter - 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
DeployModule#ReserveManager - 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
DeployModule#SimpleERC20 - 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
DeployModule#UpdateReservesProxySimplified - 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
```

> **Note:** If you restart the Hardhat node, all state is lost. You must redeploy and update the config again. Clear old deployment artifacts first with `rm -rf ignition/deployments/chain-31337` before redeploying.

### 3. Update local config with deployed addresses

Update `cre/my-workflow/config.local.json` with the addresses from the deployment output. Map them as follows:

| Ignition Output | Config Field |
|---|---|
| `DeployModule#SimpleERC20` | `tokenAddress` |
| `DeployModule#ReserveManager` | `porAddress` |
| `DeployModule#UpdateReservesProxySimplified` | `proxyAddress` |
| `DeployModule#BalanceReader` | `balanceReaderAddress` |
| `DeployModule#MessageEmitter` | `messageEmitterAddress` |

The `local-settings` target in `workflow.yaml` points to `config.local.json`, and the `local-settings` target in `project.yaml` points the RPC to `http://127.0.0.1:8545`.

### 4. Simulate with broadcast

From the `cre/` directory, run the simulation against your local node:

```bash
cre workflow simulate my-workflow -T local-settings --broadcast
```

The Hardhat node terminal will display every transaction in real time: contract calls, gas used, and emitted events.

### Deploying to BNB Testnet

To deploy and test on BNB Smart Chain testnet instead of locally:

1. Add your private key to `cre/.env`:

   ```
   PRIVATE_KEY=your_private_key_here
   ```

2. Fund your account with tBNB from a faucet (no mainnet balance required):
   - [Bitbond Faucet](https://tokentool.bitbond.com/faucet/bsc-testnet) (0.01 tBNB / 24h)
   - [GHOST Faucet](https://ghostchain.io/faucet/bnb-testnet/)

3. Deploy from the project root:

   ```bash
   npx hardhat run scripts/deploy-bnb.ts --network bscTestnet
   ```

4. Update `cre/my-workflow/config.staging.json` with the deployed contract addresses.

5. Simulate against BNB testnet:

   ```bash
   cre workflow simulate my-workflow -T staging-settings --broadcast
   ```

### Known Issue: Generated Binding Type Errors

After running `cre generate-bindings`, the CRE compiler may fail with TypeScript type errors in the generated files (`contracts/evm/ts/generated/*.ts`). This is a known incompatibility between the code generator and viem's types.

**Fix:** From the `cre/` directory, run:

```bash
./fix-generated-types.sh
```

This adds `// @ts-nocheck` to all generated binding files. Re-run this script each time you regenerate bindings.

---

## Security Considerations

**⚠️ Important Notes**

1. **Demo project** – Not production-ready.
2. **Demo contracts** – Not audited; do not use as-is in production.
3. **Use your own RPCs** – For stability and performance, prefer private RPCs for deployment and chain writes.
4. **Secrets hygiene** – Keep real secrets out of version control; use secure secret managers for `.env` values.

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

```
```

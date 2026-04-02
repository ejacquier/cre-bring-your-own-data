// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BalanceReader {
    function getNativeBalances(address[] calldata addresses) external view returns (uint256[] memory) {
        uint256[] memory balances = new uint256[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            balances[i] = addresses[i].balance;
        }
        return balances;
    }

    function typeAndVersion() external pure returns (string memory) {
        return "BalanceReader 1.0.0";
    }
}

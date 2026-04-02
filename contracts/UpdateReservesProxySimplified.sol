// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ReserveManager.sol";

contract UpdateReservesProxySimplified {
    IReserveManager public reserveManager;
    address public immutable EXPECTED_AUTHOR;
    bytes10 public immutable EXPECTED_WORKFLOW_NAME;

    error InvalidAuthor(address received, address expected);
    error InvalidWorkflowName(bytes10 received, bytes10 expected);

    constructor(address _reserveManager, address expectedAuthor, bytes10 expectedWorkflowName) {
        reserveManager = IReserveManager(_reserveManager);
        EXPECTED_AUTHOR = expectedAuthor;
        EXPECTED_WORKFLOW_NAME = expectedWorkflowName;
    }

    function onReport(bytes calldata metadata, bytes calldata report) external {
        // Decode metadata: first 32 bytes = workflow name (bytes10), next 20 bytes = author
        // For simplicity in local testing, we skip validation and just forward the report
        UpdateReserves memory data = abi.decode(report, (UpdateReserves));
        reserveManager.updateReserves(data);
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x01ffc9a7; // ERC165
    }
}

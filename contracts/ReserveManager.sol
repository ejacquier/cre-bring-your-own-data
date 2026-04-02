// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct UpdateReserves {
    uint256 totalMinted;
    uint256 totalReserve;
}

interface IReserveManager {
    function updateReserves(UpdateReserves calldata updateReserves) external;
    function lastTotalMinted() external view returns (uint256);
    function lastTotalReserve() external view returns (uint256);
}

contract ReserveManager is IReserveManager {
    uint256 public lastTotalMinted;
    uint256 public lastTotalReserve;

    event RequestReserveUpdate(uint256 requestId);

    uint256 private _requestCounter;

    function updateReserves(UpdateReserves calldata _updateReserves) external {
        lastTotalMinted = _updateReserves.totalMinted;
        lastTotalReserve = _updateReserves.totalReserve;
        _requestCounter++;
        emit RequestReserveUpdate(_requestCounter);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MessageEmitter {
    mapping(address => mapping(uint256 => string)) private _messages;
    mapping(address => uint256) private _lastTimestamp;

    event MessageEmitted(address indexed emitter, uint256 indexed timestamp, string message);

    function emitMessage(string calldata message) external {
        uint256 ts = block.timestamp;
        _messages[msg.sender][ts] = message;
        _lastTimestamp[msg.sender] = ts;
        emit MessageEmitted(msg.sender, ts, message);
    }

    function getLastMessage(address emitter) external view returns (string memory) {
        uint256 ts = _lastTimestamp[emitter];
        return _messages[emitter][ts];
    }

    function getMessage(address emitter, uint256 timestamp) external view returns (string memory) {
        return _messages[emitter][timestamp];
    }

    function typeAndVersion() external pure returns (string memory) {
        return "MessageEmitter 1.0.0";
    }
}

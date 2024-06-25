// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {UserOperation} from "./UserOperation.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WhiteListSessionValidationModule is Ownable {
    // execute(address,uint256,bytes)
    bytes4 public constant EXECUTE_SELECTOR = 0xb61d27f6;
    // execute_ncC(address,uint256,bytes)
    bytes4 public constant EXECUTE_OPTIMIZED_SELECTOR = 0x0000189a;

    mapping(address => bool) public whiteList;

    event WhiteListAdded(address indexed _address);
    event WhiteListRemoved(address indexed _address);

    constructor(address initialOwner, address[] memory _addresses) Ownable(initialOwner) {
        for (uint256 i = 0; i < _addresses.length; i++) {
            whiteList[_addresses[i]] = true;
        }
    }

    function addWhiteList(address _address) external onlyOwner {
        whiteList[_address] = true;
        emit WhiteListAdded(_address);
    }

    function removeWhiteList(address _address) external onlyOwner {
        whiteList[_address] = false;
        emit WhiteListRemoved(_address);
    }

    /**
     * @dev validates if the _op (UserOperation) matches the SessionKey permissions
     * and that _op has been signed by this SessionKey
     * Please mind the decimals of your exact token when setting maxAmount
     * @param _op User Operation to be validated.
     * @param _userOpHash Hash of the User Operation to be validated.
     * @param _sessionKeyData SessionKey data, that describes sessionKey permissions
     * @param _sessionKeySignature Signature over the the _userOpHash.
     * @return true if the _op is valid, false otherwise.
     */
    function validateSessionUserOp(
        UserOperation calldata _op,
        bytes32 _userOpHash,
        bytes calldata _sessionKeyData,
        bytes calldata _sessionKeySignature
    ) external view returns (bool) {
        require(
            bytes4(_op.callData[0:4]) == EXECUTE_OPTIMIZED_SELECTOR ||
                bytes4(_op.callData[0:4]) == EXECUTE_SELECTOR,
            "Invalid Selector"
        );

        bytes32 userOpHash = _userOpHash;

        (
            address sessionKey,
        ) = abi.decode(_sessionKeyData, (address, address));

        {
            // we expect _op.callData to be `SmartAccount.execute(to, value, calldata)` calldata
            (address _kipAddress, , ) = abi.decode(
                _op.callData[4:], // skip selector
                (address, uint256, bytes)
            );
            require(whiteList[_kipAddress], "Not contract of KIP");
        }

        return
            ECDSA.recover(
                MessageHashUtils.toEthSignedMessageHash(userOpHash),
                _sessionKeySignature
            ) == sessionKey;
    }
}
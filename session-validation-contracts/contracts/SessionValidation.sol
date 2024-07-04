// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.20;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {UserOperation} from "./UserOperation.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SessionValidation is Ownable {
    // execute(address,uint256,bytes)
    bytes4 public constant EXECUTE_SELECTOR = 0xb61d27f6;
    // execute_ncC(address,uint256,bytes)
    bytes4 public constant EXECUTE_OPTIMIZED_SELECTOR = 0x0000189a;

    mapping(address => bool) public whiteList;

    event Whitelist(address indexed contractAddress, bool status);

    constructor(
        address initialOwner,
        address[] memory addresses
    ) Ownable(initialOwner) {
        for (uint256 i = 0; i < addresses.length; i++) {
            whiteList[addresses[i]] = true;
        }
    }

    function whitelist(
        address contractAddress,
        bool status
    ) external onlyOwner {
        whiteList[contractAddress] = status;

        emit Whitelist(contractAddress, status);
    }

    /**
     * @dev validates if the _op (UserOperation) matches the SessionKey permissions
     * and that _op has been signed by this SessionKey
     * Please mind the decimals of your exact token when setting maxAmount
     * @param op User Operation to be validated.
     * @param userOpHash Hash of the User Operation to be validated.
     * @param sessionKeyData SessionKey data, that describes sessionKey permissions
     * @param sessionKeySignature Signature over the the _userOpHash.
     * @return true if the _op is valid, false otherwise.
     */
    function validateSessionUserOp(
        UserOperation calldata op,
        bytes32 userOpHash,
        bytes calldata sessionKeyData,
        bytes calldata sessionKeySignature
    ) external view returns (bool) {
        require(
            bytes4(op.callData[0:4]) == EXECUTE_OPTIMIZED_SELECTOR ||
                bytes4(op.callData[0:4]) == EXECUTE_SELECTOR,
            "Invalid Selector"
        );

        (address sessionKey, ) = abi.decode(sessionKeyData, (address, address));
        (address to, , ) = abi.decode(
            op.callData[4:],
            (address, uint256, bytes)
        );
        require(whiteList[to], "Contract is not supported");

        address signer = ECDSA.recover(
            MessageHashUtils.toEthSignedMessageHash(userOpHash),
            sessionKeySignature
        );
        return signer == sessionKey;
    }
}

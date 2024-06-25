// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTokenMock is ERC721, Ownable {
    constructor(address initialOwner) 
        ERC721("NFTokenMock", "NFTokenMock") 
        Ownable(initialOwner) {}

    /**
    * @dev Mints a new NFT.
    * @param _to The address that will own the minted NFT.
    * @param _tokenId of the NFT to be minted by the msg.sender.
    */
    function mint(
        address _to,
        uint256 _tokenId
    )
        external
        onlyOwner
    {
        super._mint(_to, _tokenId);
    }

}
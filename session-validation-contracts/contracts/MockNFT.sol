// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNFT is ERC721 {
    constructor() ERC721("MockNFT", "Mock721") {}

    /**
     * @dev Mints a new NFT.
     * @param to The address that will own the minted NFT.
     * @param tokenId of the NFT to be minted by the msg.sender.
     */
    function mint(address to, uint256 tokenId) external {
        super._mint(to, tokenId);
    }
}

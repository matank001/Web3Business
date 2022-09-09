// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.0;

import "./ERC20TokenTemplate.sol";

contract ERC20TokenVendor{

    ERC20TokenTemplate my_token;
    uint8 public convert_ratio = 0; //gwei to token

    event buy_tokens_event(address buyer, uint256 amount);

    constructor(address erc20_address, uint8 _convert_ratio) public{
        my_token = ERC20TokenTemplate(erc20_address);
        convert_ratio = _convert_ratio;
    }

    function buy_tokens() public payable{
        uint256 amount_in_token = msg.value * convert_ratio;

        require(msg.value >= 0, "Send some ether first");
        require(amount_in_token <= my_token.balanceOf(address(this)), "No money in vendor");

        // Transfer token to the msg.sender
        bool sent = my_token.transfer(msg.sender, amount_in_token);
        require(sent, "Failed to transfer token to user");

        emit buy_tokens_event(msg.sender, amount_in_token);
    }


}
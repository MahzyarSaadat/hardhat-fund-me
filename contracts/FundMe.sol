// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./priceConvertor.sol";

error FundME__NotOwner();
error FundMe__CallFail();

contract FundMe {
    using priceConvertor for uint256;

    uint256 constant MINIMUM_USD = 10 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunders;
    address immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fundMe() public payable {
        require(
            msg.value.getConversion(s_priceFeed) > MINIMUM_USD,
            "didn't send enough"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunders[msg.sender] += msg.value;
    }

    function withdraw() public only_owner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunders[funder] = 0;
        }

        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "call fail");
    }

    modifier only_owner() {
        if (msg.sender != i_owner) revert FundME__NotOwner();
        _;
    }

    function cheaperWithdraw() public payable only_owner {
        address[] memory funders = s_funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunders[funder] = 0;
        }
        s_funders = new address[](0);

        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "call fail");
    }

    receive() external payable {
        fundMe();
    }

    fallback() external payable {
        fundMe();
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAmout(address funder) public view returns (uint256) {
        return s_addressToAmountFunders[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}

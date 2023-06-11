// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library priceConvertor {
    function getPrice(
        AggregatorV3Interface _priceFeed
    ) internal view returns (uint256) {
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        (, int256 answer, , , ) = _priceFeed.latestRoundData();
        return uint256(answer * 1e10);
        // 174555037974
    }

    function getConversion(
        uint256 _amount,
        AggregatorV3Interface _priceFeed
    ) internal view returns (uint256) {
        uint256 ethAmount = getPrice(_priceFeed);
        uint256 ethAmountUsd = (_amount * ethAmount) / 1e18;
        return ethAmountUsd;
    }
}

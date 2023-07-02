//import

const { network } = require("hardhat")
const { networkConfig, deploymentsChians } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const networkChainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (deploymentsChians.includes(network.name)) {
        const ethUsdPriceFeed = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdPriceFeed.address
    } else {
        ethUsdPriceFeedAddress =
            networkConfig[networkChainId]["ethUsdPriceFeed"]
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1,
    })
    log("funMe deployd ...")
    log("---------------------------")

    if (
        !deploymentsChians.includes(network.name) &&
        process.env.ETHERSCAN_API
    ) {
        console.log("verifying process ...")
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fund"]

require("@nomicfoundation/hardhat-toolbox")
require("etherscan")
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("dotenv").config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
// const COINMARKETCAP_API = process.env.COINMARKETCAP_API

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.18",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY_1],
            chainId: 11155111,
            blockConfirmation: 6,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: true,
        noColors: true,
        outputFile: "gasReporter.txt",
        currency: "USD",
        // coinmarketcap: COINMARKETCAP_API,
        token: "ETH",
    },
}

//95935 funMe ave ----------- max: 104485
//56975 withdraw ave  ---------max: 78329

//imports
const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verify")) {
            console.log("already verify")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }

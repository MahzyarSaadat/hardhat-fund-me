const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    const transactionResponse = await fundMe.fundMe({
        value: ethers.utils.parseEther("0.1"),
    })
    await transactionResponse.wait(1)
    console.log("FundMe deployed!")
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })

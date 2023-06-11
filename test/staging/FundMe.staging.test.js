const { ethers, getNamedAccounts, network } = require("hardhat")
const { deploymentsChians } = require("../../helper-hardhat-config")
const { assert } = require("chai")

deploymentsChians.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe, deployer
          let sendEther = ethers.utils.parseEther("1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              // let deployer = await getNamedAccounts.deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async () => {
              await fundMe.fundMe({ value: sendEther })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.address
              )
              assert(endingBalance.toString(), "0")
          })
      })

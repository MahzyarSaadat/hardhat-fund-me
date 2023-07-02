const { assert } = require("chai")
const { ethers, getNamedAccounts, network, deployments } = require("hardhat")
const { deploymentsChians } = require("../../helper-hardhat-config")
deploymentsChians.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundme, deployer
          const ethAmount = ethers.utils.parseEther("1")
          this.beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundme = await ethers.getContract("FundMe", deployer)
              await fundme.deployed()
          })

          it("allows people to fund and withdraw", async () => {
              await fundme.fund({ value: ethAmount })
              const transactionResponse = await fundme.withdraw()
              await transactionResponse.wait(1)
              const endingBalance = await ethers.provider.getBalance(
                  fundme.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })

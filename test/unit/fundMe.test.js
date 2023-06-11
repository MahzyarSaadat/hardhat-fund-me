//imports

const { assert, expect } = require("chai")
const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { deploymentsChians } = require("../../helper-hardhat-config")

!deploymentsChians.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe, deployer, mockV3Aggregator
          let sendVal = ethers.utils.parseEther("1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", function () {
              it("sets the constructor Argumenrts correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", function () {
              it("send enogth ether", async () => {
                  expect(fundMe.fundMe()).to.be.revertedWith(
                      "didn't send enough"
                  )
              })

              it("funder add to funders array", async () => {
                  await fundMe.fundMe({ value: sendVal })
                  let funder = await fundMe.getFunders(0)
                  assert.equal(funder, deployer)
              })

              it("updated the funderOfContract correctly", async () => {
                  await fundMe.fundMe({ value: sendVal })
                  let funder = await fundMe.getAmout(deployer)
                  assert.equal(funder.toString(), sendVal.toString())
              })
          })

          describe("withdraw", function () {
              beforeEach(async () => {
                  await fundMe.fundMe({ value: sendVal })
              })

              it("withdraw eth from a single funder", async () => {
                  //Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.address)

                  // console.log(startingFundMeBalance.toString())

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // console.log(startingDeployerBalance.toString())

                  //Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReciept = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReciept
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  //Assert
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  // console.log(endingFundMeBalance.toString())

                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // console.log(endingDeployerBalance.toString())

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("allows us to withdraw from multiple Accounts", async () => {
                  //Arrange
                  const accounts = await ethers.getSigners()
                  // console.log(accounts)
                  for (let index = 1; index < 6; index++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[index]
                      )
                      await fundMeConnectedContract.fundMe({ value: sendVal })
                  }

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.address)

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReciept = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReciept
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  //assert
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )

                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  //Make sure that the funders reset properly
                  await expect(fundMe.getFunders(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAmout(accounts[i].address),
                          0
                      )
                  }
              })

              it("only owner can use withdraw function", async () => {
                  const accounts = await ethers.getSigners()
                  const attaker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attaker
                  )
                  await expect(attackerConnectedContract.withdraw()).to.be
                      .reverted
              })

              it("cheaperWithdraw", async () => {
                  //Arrange
                  const accounts = await ethers.getSigners()
                  // console.log(accounts)
                  for (let index = 1; index < 6; index++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[index]
                      )
                      await fundMeConnectedContract.fundMe({ value: sendVal })
                  }

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.address)

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReciept = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReciept
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  //assert
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )

                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  //Make sure that the funders reset properly
                  await expect(fundMe.getFunders(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAmout(accounts[i].address),
                          0
                      )
                  }
              })

              it("single cheaper withdraw test...", async () => {
                  //Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.address)

                  // console.log(startingFundMeBalance.toString())

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // console.log(startingDeployerBalance.toString())

                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReciept = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReciept
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  //Assert
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  // console.log(endingFundMeBalance.toString())

                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // console.log(endingDeployerBalance.toString())

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
          })
      })

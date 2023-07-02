const connectBtn = document.getElementById("connect-metamask")
const fundBtn = document.getElementById("fund-btn")
const balance = document.getElementById("balance")
const withdrawButton = document.getElementById("withdraw_btn")

balance.onclick = getBalance
connectBtn.onclick = connect
fundBtn.onclick = fund
withdrawButton.onclick = withdraw

import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            if (error.code === 4001) {
                console.error("please connect to metamask")
            }
        }
        const account = await ethereum.request({ method: "eth_accounts" })
        console.log(account)

        connectBtn.innerHTML = "connected"
    } else {
        connectBtn.innerHTML = "connect"
        console.log("please install metamask")
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            const balance = await provider.getBalance(contractAddress)
            console.log(ethers.utils.formatEther(balance))
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = "Please install MetaMask"
    }
}

async function withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            // await transactionResponse.wait(1)
        } catch (error) {
            console.log(error)
        }
    } else {
        withdrawButton.innerHTML = "Please install MetaMask"
    }
}

async function fund() {
    const ethAmount = document.getElementById("get_balance").value
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fundMe({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("done")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(`Completed with ${transactionReceipt.confirmations} confirmations. `)
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}

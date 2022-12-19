const { expect } = require("chai")
const { BigNumber } = require("ethers")
const { ethers, waffle } = require("hardhat")

describe("Attack on Good.sol", () => {
    it("Attack.sol changes the owner of Good.sol using delegateCall", async () => {
        // Deploying Helper.sol
        const helperFactory = await ethers.getContractFactory("Helper")
        const helperContract = await helperFactory.deploy()
        await helperContract.deployed()
        console.log(`Helper.sol => ${helperContract.address}`)

        // Deploying Good.sol
        const goodFactory = await ethers.getContractFactory("Good")
        const goodContract = await goodFactory.deploy(helperContract.address)
        await goodContract.deployed()
        console.log(`Good.sol => ${goodContract.address}`)

        // Deploying Attack.sol
        const attackFactory = await ethers.getContractFactory("Attack")
        const attackContract = await attackFactory.deploy(goodContract.address)
        await attackContract.deployed()
        console.log(`Attack.sol => ${attackContract.address}`)

        // Attacking Good.sol
        let attackTx = await attackContract.attack()
        await attackTx.wait(1)

        // Checking the if attackContract is the owner of goodContract
        expect(await goodContract.owner()).to.be.equal(attackContract.address)
    })
})

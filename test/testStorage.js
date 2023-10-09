const hre = require("hardhat")
const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")

describe("StorageCollider", async function() {
    async function deployFixture() {
        const StorageLibrary = await hre.ethers.deployContract("StorageLibrary")
        console.log("StorageLibrary address: ", await StorageLibrary.getAddress())

        const sc = await hre.ethers.deployContract("StorageCollider", {
            libraries: {
                StorageLibrary: await StorageLibrary.getAddress()
            }
        })

        return { sc }
    }

    it("Should be correct deploy", async function() {
        const { sc } = await loadFixture(deployFixture)
        console.log("StorageCollider address: ", await sc.getAddress())
        expect(await sc.getAddress()).to.exist
    })

    it("Should be collied With Another Contract", async function() {
        const { sc } = await loadFixture(deployFixture)
        expect(await sc.getArray()).to.empty
        console.log("Array before collied", await sc.getArray())
        await sc.colliedWithAnotherContract()
        console.log("Array after collied", await sc.getArray())
        expect(await sc.getArray()).to.deep.equal([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
    })

    it("Should be correct work collide with library", async function() {
        const { sc } = await loadFixture(deployFixture)
        expect(await sc.getArray()).to.empty
        console.log("Array before collied", await sc.getArray())
        await sc.collide()
        console.log("Array after collied", await sc.getArray())
        expect(await sc.getArray()).to.deep.equal([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
    })
})
const hre = require("hardhat")

async function main(){
    const StorageLibrary = await hre.ethers.deployContract("StorageLibrary");
    await StorageLibrary.waitForDeployment();
    console.log("Library Deploy at address: ", await StorageLibrary.getAddress());

    const sc = await hre.ethers.deployContract("StorageCollider", {
        libraries: {
            StorageLibrary: await StorageLibrary.getAddress()
        }
    });
    await sc.waitForDeployment();
    console.log("StorageCollider has a deployment address: ", await sc.getAddress());

    const signer = await hre.ethers.provider.getSigner();
    const contractAddress = "0xda3e387243924efa9c52783eF2D386C8243614a6";
    const ABI = [{"inputs":[{"internalType":"contract StorageCollider","name":"collider_","type":"address"}],"name":"validate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
    const contract = await new hre.ethers.Contract(contractAddress, ABI, signer);

    const isValid = await contract.validate(await sc.getAddress());
    await isValid.wait();
    if (isValid) {
        console.log("Validation successful.");
    } else {
        console.log("Validation failed.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
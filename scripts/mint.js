const { ethers, utils } = require("ethers");
const fs = require('fs');
const { generate, derive } = require('../libs/address_generator')

async function main() {
    const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
    const ABI = JSON.parse(fs.readFileSync('./artifacts/contracts/' + configs.contract_name + '.sol/' + configs.contract_name + '.json').toString())
    const provider = new ethers.providers.JsonRpcProvider(configs.provider);
    let wallet = new ethers.Wallet(configs.owner_key).connect(provider)
    const contract = new ethers.Contract(configs.contract_address, ABI.abi, wallet)

    const amountPub = 14
    const address = "0x90479ec4e0506BC297CD80b855151aD2ba4bd997"
    const tier = "0xc763F628c8_993845"
    console.log("Minting", amountPub, "of", tier)

    try {
        const gasPrice = (await provider.getGasPrice()).mul(2)
        const resultPub = await contract.mint(address, tier, amountPub, { gasPrice })
        console.log("Waiting at: " + resultPub.hash)
        await resultPub.wait()
    } catch (e) {
        console.log("FAILED")
        console.log(e.message)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

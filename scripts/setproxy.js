const { ethers, utils } = require("ethers");
const fs = require('fs');
const { generate, derive } = require('../libs/address_generator')

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function main() {
    const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
    const ABI = JSON.parse(fs.readFileSync('./artifacts/contracts/' + configs.contract_name + '.sol/' + configs.contract_name + '.json').toString())
    const provider = new ethers.providers.JsonRpcProvider(configs.provider);
    let wallet = new ethers.Wallet(configs.owner_key).connect(provider)
    const contract = new ethers.Contract(configs.contract_address, ABI.abi, wallet)
    // console.log(wallet.address)
    let nonce = await provider.getTransactionCount(wallet.address)
    const gasPrice = (await provider.getGasPrice()).mul(2)

    // set proxy address 0
    console.log("Adding minter:", "0x42694cac013b230e035f85bc2e158aff49bfe4cf")
    const result = await contract.setProxyAddress("0x42694cac013b230e035f85bc2e158aff49bfe4cf", true, { nonce: nonce, gasPrice })
    console.log("Pending tx:", result.hash)
    await result.wait()
    console.log('-> Done!')
    await sleep(3000)

    // set proxy address 1
    nonce = await provider.getTransactionCount(wallet.address)
    const result2 = await contract.setProxyAddress(wallet.address, true, { nonce: nonce, gasPrice })
    console.log("Pending tx:", result2.hash)
    await result2.wait()
    console.log('-> Done!')
    await sleep(3000)

    // set proxy address 2
    nonce = await provider.getTransactionCount(wallet.address)
    const result3 = await contract.setProxyAddress("0xad26228f2fb636eaf37db0a31ab6fbe5f92bc49a", true, { nonce: nonce, gasPrice })
    console.log("Pending tx:", result3.hash)
    await result3.wait()

    console.log('-> Done!')
    await sleep(3000)

    // set proxy address 3
    nonce = await provider.getTransactionCount(wallet.address)
    console.log("Adding minter:", "0x6783f0f7FFF0F60E277a29D4B762C312Ec5463F8")
    result4 = await contract.setProxyAddress("0x6783f0f7FFF0F60E277a29D4B762C312Ec5463F8", true, { nonce: nonce, gasPrice })
    console.log("Pending tx:", result4.hash)
    await result4.wait()
    console.log('-> Done!')
    await sleep(3000)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

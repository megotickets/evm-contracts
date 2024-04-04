const { ethers, utils } = require("ethers");
const fs = require('fs');

async function main() {
    const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
    const ABI = JSON.parse(fs.readFileSync('./artifacts/contracts/' + configs.contract_name + '.sol/' + configs.contract_name + '.json').toString())
    const provider = new ethers.providers.JsonRpcProvider(configs.provider);
    let wallet = new ethers.Wallet(configs.owner_key).connect(provider)
    const contract = new ethers.Contract(configs.contract_address, ABI.abi, wallet)
    const TIERS = configs.tiers

    for (let k in TIERS) {
        console.log('Changing plan ' + k)
        const gasPrice = (await provider.getGasPrice()).mul(2)
        try {
            const nonce = await provider.getTransactionCount(wallet.address)
            const result = await contract.manageTickets(k, TIERS[k].owner, TIERS[k].name, TIERS[k].description, TIERS[k].image, { nonce: nonce, gasPrice })
            console.log("Pending transaction:", result.hash)
            await result.wait()
            console.log('-> Plan changed!')
        } catch (e) {
            console.log(e.message)
            console.log("Can't change plan.")
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

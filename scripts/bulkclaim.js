const { ethers, utils } = require("ethers");
const fs = require('fs');
const { generate, derive } = require('../libs/address_generator')
const axios = require('axios')
async function sleep() {
    return new Promise(response => {
        setTimeout(function () {
            response(true)
        }, 1000)
    })
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');

    return response;
}

async function main() {
    const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
    const ABI = JSON.parse(fs.readFileSync('./artifacts/contracts/' + configs.contract_name + '.sol/' + configs.contract_name + '.json').toString())
    const provider = new ethers.providers.JsonRpcProvider(configs.provider);
    let wallet = new ethers.Wallet(configs.owner_key).connect(provider)
    const contract = new ethers.Contract(configs.contract_address, ABI.abi, wallet)
    const tokensOfOwner = await contract.tokensOfOwner("0xTOKEN_OWNER")
    for (let k in tokensOfOwner) {
        const tokenId = tokensOfOwner[k].toString()
        console.log('Claiming ' + tokenId)
        const message = "Claiming token " + tokenId + " for the entrance."
        const signature = await wallet.signMessage(message)
        const img = await axios.post("TICKET_API/nfts/claim", {
            signature: signature,
            tokenId: tokenId
        })
        console.log("-> done, saving..")
        const imageBuffer = decodeBase64Image(img.data.qr);
        const tier = await contract._idToTier(tokenId)
        const filename = "./tickets/" + new Date().getTime() + "_" + tokenId + "_" + tier + "_" + k + '.png'
        console.log("Saving at:", filename)
        fs.writeFileSync(filename, imageBuffer.data);
        await sleep()
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

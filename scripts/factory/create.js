const { ethers, utils } = require("ethers");
const fs = require("fs");

async function main() {
    const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString());
    configs.contract_name = "MegoTicketsFactory";
    const ABI = JSON.parse(
        fs
            .readFileSync(
                "./artifacts/contracts/" +
                configs.contract_name +
                ".sol/" +
                configs.contract_name +
                ".json"
            )
            .toString()
    );
    const provider = new ethers.providers.JsonRpcProvider(configs.provider);
    let wallet = new ethers.Wallet(configs.owner_key).connect(provider);
    const contract = new ethers.Contract(
        configs.contract_address,
        ABI.abi,
        wallet
    );

    const name = "My Awesome Event";
    const ticker = "MYEVENT";
    try {
        const gasPrice = (await provider.getGasPrice()).mul(2);
        const resultPub = await contract.createMegoTicketsPublic(name, ticker, {
            gasPrice,
        });
        console.log("Waiting at: " + resultPub.hash);
        const receipt = await resultPub.wait();
        const deployedEvent = receipt.events.find(event => event.event === "MegoTicketsPublicDeployed");
        if (deployedEvent) {
            console.log("Contract created at:", deployedEvent.args.deployedAddress);
        } else {
            console.log("Deployed event not found in the transaction receipt.");
        }
    } catch (e) {
        console.log("FAILED");
        console.log(e.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

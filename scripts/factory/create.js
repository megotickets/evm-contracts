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
        configs.factory_address,
        ABI.abi,
        wallet
    );

    const name = "My Awesome Event";
    const ticker = "MYEVENT";
    const proxyAddress = "0x42694cac013b230e035f85bc2e158aff49bfe4cf";

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
            const MEGO_ABI = JSON.parse(
                fs
                    .readFileSync(
                        "./artifacts/contracts/MegoTicketsPublic.sol/MegoTicketsPublic.json"
                    )
                    .toString()
            );
            const megoContract = new ethers.Contract(deployedEvent.args.deployedAddress, MEGO_ABI.abi, wallet);
            const ownerOfContract = await megoContract.owner();
            console.log("Owner of contract:", ownerOfContract);
            const result = await megoContract.setProxyAddress(proxyAddress, true, {
                gasPrice,
            });
            console.log("Waiting at: " + result.hash);
            await result.wait();
            console.log("Proxy address set correctly");
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

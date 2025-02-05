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

    try {
        const deployedContracts = await contract.getAllDeployedContracts();
        console.table(deployedContracts);

        const deployedByOwner = await contract.getDeployedContracts(configs.owner_address);
        console.table(deployedByOwner);
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

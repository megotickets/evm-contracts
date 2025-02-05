const hre = require("hardhat");
const fs = require('fs');

async function main() {
    const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
    console.log('Deploying contract..')
    const Contract = await hre.ethers.getContractFactory('MegoTicketsFactory', {});
    const contract = await Contract.deploy();
    console.log('Deploy transaction is: ' + contract.deployTransaction.hash)
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);
    configs.factory_address = contract.address
    fs.writeFileSync(process.env.CONFIG, JSON.stringify(configs, null, 4))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

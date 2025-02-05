const { ethers, utils } = require("ethers");
const fs = require("fs");
const { generate, derive } = require("../libs/address_generator");

async function main() {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString());
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

  const amountPub = 1;
  const address = "0xE6c30AD5AeE7AD22e9F39D51d67667587cdD05A1";
  const tier = Object.keys(configs.tiers)[0];
  console.log("Minting", amountPub, "of", tier);

  try {
    const gasPrice = (await provider.getGasPrice()).mul(2);
    const resultPub = await contract.mint(address, tier, amountPub, {
      gasPrice,
    });
    console.log("Waiting at: " + resultPub.hash);
    await resultPub.wait();
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

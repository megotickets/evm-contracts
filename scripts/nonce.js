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
  let nonce = await provider.getTransactionCount(
    "0x42694cac013b230e035f85bc2e158aff49bfe4cf"
  );
  console.log("Nonce:", nonce);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

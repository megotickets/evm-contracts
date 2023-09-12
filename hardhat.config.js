require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

let provider = 'http://localhost:8545'
let hardhatConfigs = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      url: provider
    },
    polygon: {
      url: provider
    },
    goerli: {
      url: provider
    },
    linea: {
      url: provider
    },
    optimism: {
      url: provider
    },
    ropsten: {
      url: provider
    },
    mainnet: {
      url: provider
    },
    quadrans: {
      url: provider,
      verify: {
        apiUrl: 'https://explorer.quadrans.io/api',
        apiKey: 'NO_API_KEY_NEEDED',
        explorerUrl: 'https://explorer.quadrans.io/address',
      }
    },
    'base-goerli': {
      url: provider
    },
  },
  solidity: "0.8.6",
}

if (process.env.ACCOUNTS !== undefined) {
  for (let k in hardhatConfigs.networks) {
    hardhatConfigs.networks[k].accounts = []
    for (let a in process.env.ACCOUNTS.split(',')) {
      if (k === 'hardhat') {
        hardhatConfigs.networks[k].accounts.push({
          privateKey: process.env.ACCOUNTS.split(',')[a],
          balance: "10000000000000000000000000000000000000"
        })
      } else {
        hardhatConfigs.networks[k].accounts.push(process.env.ACCOUNTS.split(',')[a])
      }
    }
  }
}

if (process.env.PROVIDER !== undefined) {
  for (let k in hardhatConfigs.networks) {
    if (k !== 'hardhat') {
      hardhatConfigs.networks[k].url = process.env.PROVIDER
    }
  }
}

if (process.env.POLYGONSCAN !== undefined && process.env.POLYGONSCAN !== '') {
  hardhatConfigs.etherscan = { apiKey: { polygonMumbai: process.env.POLYGONSCAN, polygon: process.env.POLYGONSCAN } }
}

if (process.env.ETHERSCAN !== undefined && process.env.ETHERSCAN !== '') {
  hardhatConfigs.etherscan = {
    apiKey: {
      mainnet: process.env.ETHERSCAN,
      rinkeby: process.env.ETHERSCAN,
      goerli: process.env.ETHERSCAN,
      optimisticEthereum: process.env.ETHERSCAN,
      linea: process.env.ETHERSCAN,
      'base-goerli': 'NO_API_KEY_NEEDED',
      'quadrans': 'NO_API_KEY_NEEDED'
    },
    customChains: [
      {
        network: "base-goerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org"
        }
      },
      {
        network: "quadrans",
        chainId: 10946,
        urls: {
          apiURL: "https://explorer.quadrans.io/api",
          browserURL: "https://explorer.quadrans.io/address"
        }
      }
    ]
  }
}

module.exports = hardhatConfigs;

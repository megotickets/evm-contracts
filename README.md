# MEGO TICKETS - EVM contracts

This repository contains the EVM contracts for the MEGO TICKETS project. 
If you want to create your own ticket contract you can use this repository as a template, all allowed contracts will be listed on the MEGO backend, so you can use the MEGO app to buy tickets for your event.

## How to create your own ticket contract

Main requirement is that your contract implements the `mint` function, which is used to create new tickets and you allow the MEGO backend to call this function. You can fork this repository and use the `MegoTicketsPublic.sol` contract as a template.

## Whitelist our proxy address

In order to allow the MEGO backend to call your `mint` function you have to whitelist our proxy address `0x42694CAc013b230e035F85Bc2E158aFf49BFe4CF` in your contract. This address will send the transactions for you and will send the minted tickets to the buyer. You can deploy the contract in any EVM chain and if not supported yet, we'll add in our backend during the onboarding process.

## Deployed contracts

| Contract Name | Network | Contract address |
| --- | --- | --- |
| Mego Tickets Public | Polygon | [0x0540f4fabe2ae63f1aac7a31da8d250d6c5cda84](https://polygonscan.com/address/0x0540f4fabe2ae63f1aac7a31da8d250d6c5cda84) |
| Mego Tickets Public | Optimism | [0x0540f4fabe2ae63f1aac7a31da8d250d6c5cda84](https://optimistic.etherscan.io/address/0x0540f4fabe2ae63f1aac7a31da8d250d6c5cda84) |
| Mego Tickets Public | Quadrans | [0x0540f4fabe2ae63f1aac7a31da8d250d6c5cda84](https://explorer.quadrans.io/address/0x0540F4fabE2AE63f1aaC7A31DA8d250d6c5CDa84/transactions) |

## How to add a new contract

For now, you can create a PR with your contract and we'll review it and add it to the `allowed_contracts.json` list.
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./MegoTicketsPublic.sol";

contract MegoTicketsFactory {
    // Mapping to keep track of contracts deployed by a specific address
    mapping(address => address[]) public deployedContracts;

    // Global array to keep track of all deployed contracts
    address[] public allDeployedContracts;

    // Event to emit when a new MegoTicketsPublic contract is deployed
    event MegoTicketsPublicDeployed(
        address indexed deployer,
        address deployedAddress
    );

    // Function to create a new MegoTicketsPublic contract
    function createMegoTicketsPublic(
        string memory _name,
        string memory _ticker,
        address _owner
    ) external returns (address) {
        MegoTicketsPublic newContract = new MegoTicketsPublic(_name, _ticker);
        address newContractAddress = address(newContract);
        newContract.transferOwnership(_owner);
        // Record the deployed contract for the sender
        deployedContracts[msg.sender].push(newContractAddress);
        // Add to the global list as well
        allDeployedContracts.push(newContractAddress);

        emit MegoTicketsPublicDeployed(msg.sender, newContractAddress);

        return newContractAddress;
    }

    // Utility function to get all contracts deployed by a particular address
    function getDeployedContracts(
        address deployer
    ) external view returns (address[] memory) {
        return deployedContracts[deployer];
    }

    // Utility function to get all deployed MegoTicketsPublic contracts
    function getAllDeployedContracts()
        external
        view
        returns (address[] memory)
    {
        return allDeployedContracts;
    }
}

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
        address deployedAddress,
        string name,
        string ticker
    );

    // Function to create a new MegoTicketsPublic contract
    function createMegoTicketsPublic(
        string memory _name,
        string memory _ticker,
        address _owner,
        address _proxyAddress
    ) external returns (address) {
        MegoTicketsPublic newContract = new MegoTicketsPublic(_name, _ticker);
        address newContractAddress = address(newContract);
        newContract.setProxyAddress(_proxyAddress, true);
        newContract.transferOwnership(_owner);
        // Record the deployed contract for the sender
        deployedContracts[_owner].push(newContractAddress);
        // Add to the global list as well
        allDeployedContracts.push(newContractAddress);

        emit MegoTicketsPublicDeployed(
            _owner,
            newContractAddress,
            _name,
            _ticker
        );

        return newContractAddress;
    }

    // Utility function to get all contracts deployed by a particular address
    function getDeployedContracts(
        address _owner
    ) external view returns (address[] memory) {
        return deployedContracts[_owner];
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

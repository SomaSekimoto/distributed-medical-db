// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract  MedicalDatabase is IMedicalDatabase {
    enum BloodType { A, B, O, AB, Unknown }
    struct Patient {
        string name;
        BloodType bloodType;
        uint256 lastUpdated;
    }

    mapping (address => Patient) private patients;


    constructor(address owner){}
    function _setUpRole() private {
    }

   function updatePatient(address patient) public {}
    function grantRole(address patient, address viewer) public {}
    function revokeRole(address patient, address viewer) public {}
    function registerPatient(address patient, string memory name, BloodType bloodType) public {}
    function registerDoctor(address doctor) public {}
    function pay(address patient, address doctor) public {}
}

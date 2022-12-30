// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

enum BloodType { A, B, O, AB, Unknown }
interface IMedicalDatabase {
    function updatePatient(address patient) external;
    function grantRole(address patient, address viewer) external;
    function revokeRole(address patient, address viewer) external;
    function registerPatient(address patient, string memory name, BloodType bloodType) external;
    function registerDoctor(address doctor) external;
    function pay(address patient, address doctor) external;
}


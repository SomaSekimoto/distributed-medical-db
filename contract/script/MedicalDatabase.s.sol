// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/MedicalDatabase.sol";

contract MedicalDatabaseScript is Script {
    function run() public {

        vm.startBroadcast();

        new MedicalDatabase();

        vm.stopBroadcast();
    }
}

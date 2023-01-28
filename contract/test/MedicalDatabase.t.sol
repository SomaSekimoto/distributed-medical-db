// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/MedicalDatabase.sol";

contract MedicalDatabaseTest is Test {
    address private doctor;
    address private patient;
    MedicalDatabase private medicalDatabase;

    function setUp() public {
        patient = vm.addr(0x123);
        medicalDatabase = new MedicalDatabase();
        doctor = msg.sender;
        vm.prank(doctor);
        medicalDatabase.registerDoctor(doctor);
    }

    function testRegisterPatient() public {
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        MedicalDatabase.Patient memory p = medicalDatabase.getPatientData(patient);
        vm.stopPrank();
        assertEq(p.name, name);
        assertEq(uint8(p.bloodType), uint8(bloodType));
    }

    function testRevert_OnlyMsgSender() public {
        vm.startPrank(doctor);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        vm.expectRevert("the address is not the sender's");
        medicalDatabase.registerPatient(patient, name, bloodType);
        vm.stopPrank();
    }

    function testRevert_PatientAlreadyRegistered() public {
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        vm.expectRevert("patient is already registered");
        medicalDatabase.registerPatient(patient, name, bloodType);
        vm.stopPrank();
    }

    function testRegisterDoctor() public {
        address user = vm.addr(0x456);
        vm.startPrank(user);
        medicalDatabase.registerDoctor(user);
        assertEq(medicalDatabase.isDoctor(user), true);
        vm.stopPrank();
    }

    function testRemoveDoctor() public {
        address user = vm.addr(0x456);
        vm.startPrank(user);
        medicalDatabase.registerDoctor(user);
        assertEq(medicalDatabase.isDoctor(user), true);
        vm.stopPrank();
        vm.startPrank(doctor);
        medicalDatabase.removeDoctor(user);
        vm.stopPrank();
        assertEq(medicalDatabase.isDoctor(user), false);
    }

    function testApproveViewData() public {
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        medicalDatabase.approveViewData(patient, doctor);
        vm.stopPrank();
        vm.prank(doctor);
        MedicalDatabase.Patient memory p = medicalDatabase.getPatientData(patient);
        assertEq(p.name, name);
        assertEq(uint8(p.bloodType), uint8(bloodType));
    }

    function testRevert_OnlyViewer() public {
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        vm.stopPrank();
        vm.startPrank(doctor);
        vm.expectRevert("is not an authorized user to view data");
        medicalDatabase.getPatientData(patient);
        vm.stopPrank();
        address user = vm.addr(0x456);
        vm.startPrank(user);
        vm.expectRevert("is not an authorized user to view data");
        medicalDatabase.getPatientData(patient);
        vm.stopPrank();
    }

    function testUpdatePatient() public  {
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        medicalDatabase.approveViewData(patient, doctor);
        vm.stopPrank();
        vm.startPrank(doctor);
        Enum.BloodType bloodTypeB = Enum.BloodType.B;
        medicalDatabase.updatePatient(patient, name, Enum.BloodType.B);
        MedicalDatabase.Patient memory p = medicalDatabase.getPatientData(patient);
        vm.stopPrank();
        assertEq(uint8(p.bloodType), uint8(bloodTypeB));
    }

    function testRevert_PatientExists() public {
        address user = vm.addr(0x456);
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        vm.expectRevert("patient does not exist");
        medicalDatabase.getPatientData(user);
        vm.stopPrank();
    }

    function testRemovePatient() public  {
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        vm.stopPrank();
        vm.startPrank(doctor);
        medicalDatabase.removePatient(patient);
        vm.stopPrank();
        vm.expectRevert(bytes("patient does not exist"));
        medicalDatabase.getPatientData(patient);
    }

    function testRevert_OnlyDoctor() public {
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        vm.stopPrank();
        address user = vm.addr(0x456);
        vm.startPrank(user);
        vm.expectRevert("is not doctor");
        medicalDatabase.updatePatient(patient, name, Enum.BloodType.B);
    }

    function testRevert_OnlyApproved() public {
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        vm.stopPrank();
        vm.startPrank(doctor);
        vm.expectRevert("is not approved to view the data");
        medicalDatabase.updatePatient(patient, name, Enum.BloodType.B);
        vm.stopPrank();
    }

    function testDisapproveViewData() public {
        vm.startPrank(patient);
        Enum.BloodType bloodType = Enum.BloodType.O;
        string memory name = "John Smith";
        medicalDatabase.registerPatient(patient, name, bloodType);
        medicalDatabase.approveViewData(patient, doctor);
        vm.stopPrank();
        vm.prank(doctor);
        MedicalDatabase.Patient memory p = medicalDatabase.getPatientData(patient);
        assertEq(p.name, name);
        assertEq(uint8(p.bloodType), uint8(bloodType));
        vm.prank(patient);
        medicalDatabase.disapproveViewData(patient, doctor);
        vm.prank(doctor);
        vm.expectRevert("is not an authorized user to view data");
        medicalDatabase.getPatientData(patient);
    }

    function testPay(uint256 amount) public {
        vm.assume(amount > 0);
        startHoax(patient, amount);
        uint256 prevBalance = doctor.balance;
        medicalDatabase.pay{value: amount / 2}(doctor);
        assertEq(doctor.balance - prevBalance, amount / 2 );
    }
}
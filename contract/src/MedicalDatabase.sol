// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import './IMedicalDatabase.sol';
import './Enum.sol';
import 'openzeppelin-contracts/access/AccessControl.sol';

contract  MedicalDatabase is IMedicalDatabase, AccessControl {
    
    struct Patient {
        string name;
        Enum.BloodType bloodType;
        uint256 lastUpdated;
    }

    mapping (address => Patient) private patients;

    bytes32 private constant DOCTOR_ROLE = 0x00;

    event PatientRegistered(address patient, string name, Enum.BloodType bloodType, uint256 lastUpdated);
    event PatientUpdated(address patient, string name, Enum.BloodType bloodType, uint256 lastUpdated);
    event DoctorRegistered(address doctor, uint256 timestamp);
    event DoctorRemoved(address doctor, uint256 timestamp);
    event ApproveViewData(address patient, address viewer);
    event DisapproveViewData(address patient, address viewer);
    event Paid(address from, address to, uint256 value);

    constructor(){}

    modifier onlyDoctor(address _doctor){
        require(isDoctor(_doctor), "is not doctor");
        _;
    }
    
    modifier onlyMsgSender(address _user){
        require(msg.sender == _user, "the address is not the sender's");
        _;
    }

    modifier onlyApproved(address _patient, address _viewer){
        require(isApproved(_patient, _viewer) == true, "is not approved to view the data");
        _;
    }
    modifier patientExists(address _patient) {
        require(patients[_patient].lastUpdated != 0, "patient does not exist");
        _;
    }

    modifier onlyViewer(address _patient, address _viewer){
        require(isAuthorized(_patient, _viewer), "is not an authorized user to view data");
        _;
    }

    // 患者の登録
    function registerPatient(address _patient, string memory _name, Enum.BloodType _bloodType) public onlyMsgSender(_patient) {
        Patient memory patient = Patient(_name, _bloodType, block.timestamp);
        patients[_patient] = patient;
        emit PatientRegistered(_patient, patient.name, patient.bloodType, patient.lastUpdated);
    }
    // 医療従事者の登録
    function registerDoctor(address _doctor) public onlyMsgSender(_doctor) {
        _grantRole(DOCTOR_ROLE, _doctor);
        emit DoctorRegistered(_doctor, block.timestamp);
    }
    // 医療従事者の削除
    function removeDoctor(address _doctor) public onlyDoctor(msg.sender) {
        _revokeRole(DOCTOR_ROLE, _doctor);
        emit DoctorRemoved(_doctor, block.timestamp);
    }
    // 患者データ更新
    function updatePatient(address _patient, string memory _name, Enum.BloodType _bloodType) public patientExists(_patient) onlyDoctor(msg.sender) onlyApproved(_patient, msg.sender) {
        Patient storage patient = patients[_patient];
        patient.name = _name;
        patient.bloodType = _bloodType;
        patient.lastUpdated = block.timestamp;
        emit PatientUpdated(_patient, patient.name, patient.bloodType, patient.lastUpdated);
    }
    // 患者データの閲覧権限付与
    function approveViewData(address _patient, address _viewer) public onlyMsgSender(_patient) {
        bytes32 role = bytes32(bytes20(_patient));
        _grantRole(role, _viewer);
        emit ApproveViewData(_patient, _viewer);
    }
    // 患者データの閲覧権限削除
    function disapproveViewData(address _patient, address _viewer) public onlyMsgSender(_patient) {
        bytes32 role = bytes32(bytes20(_patient));
        _revokeRole(role, _viewer);
        emit DisapproveViewData(_patient, _viewer);
    }
    // 支払い
    function pay(address _to) payable public {
        payable(_to).transfer(msg.value);
        emit Paid(msg.sender, _to, msg.value);
    }

    function getApproved(address _patient) public view returns (bool) {
        return isApproved(_patient, msg.sender);
    }

    function getPatientData(address _patient) public patientExists(_patient) onlyViewer(_patient, msg.sender) view returns (Patient memory) {
        return patients[_patient];
    }

    function isApproved(address _patient, address _viewer) public view returns (bool) {
        bytes32 role = bytes32(bytes20(_patient));
        return hasRole(role, _viewer);
    }

    function isDoctor(address _doctor) public view returns (bool) {
        return hasRole(DOCTOR_ROLE, _doctor);
    }

    function isAuthorized(address _patient, address _viewer) internal view returns (bool) {
        return _patient == _viewer || (isApproved(_patient, _viewer) && hasRole(DOCTOR_ROLE, _viewer));
    }
}

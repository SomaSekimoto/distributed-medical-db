// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import './Enum.sol';

interface IMedicalDatabase {
    // 患者の登録
    function registerPatient(address _patient, string memory _name, Enum.BloodType _bloodType) external;
    // 医療従事者の登録
    function registerDoctor(address _doctor) external;
    // 医療従事者の削除
    function removeDoctor(address _doctor) external;
    // 患者データ更新
    function updatePatient(address _patient, string memory _name, Enum.BloodType _bloodType) external;
    // 患者データの閲覧権限付与
    function approveViewData(address _patient, address _viewer) external;
    // 患者データの閲覧権限削除
    function disapproveViewData(address _patient, address _viewer) external;
    // 支払い
    function pay(address _to) payable external;
}


// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Enum {
    // 状態を表す列挙型の定義
    enum BloodType { 
        A,
        B,
        O,
        AB,
        Unknown
    }
    
    // 列挙型の値
    BloodType internal bloodType;
}
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

    // 列挙型の値の取得
    // function get() internal view returns (BloodType) {
    //     return bloodType;
    // }

    // // 列挙型の値の指定
    // function set(BloodType _bloodType) public {
    //     bloodType = _bloodType;
    // }

    // // 列挙型の値の削除
    // function reset() public {
    //     delete bloodType;
    // }
}
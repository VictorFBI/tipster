// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TipsterToken.sol";

contract DeployTipsterToken is Script {
    function run() external {
        vm.startBroadcast();

        TipsterToken token = new TipsterToken();

        vm.stopBroadcast();
    }
}

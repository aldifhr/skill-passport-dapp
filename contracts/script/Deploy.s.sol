// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/UniversalSkillPassport.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        UniversalSkillPassport passport = new UniversalSkillPassport();
        
        console.log("UniversalSkillPassport deployed to:", address(passport));
        console.log("Admin:", passport.admin());
        
        vm.stopBroadcast();
    }
}

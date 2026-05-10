// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TipsterToken.sol";

contract TipsterTokenTest is Test {
    TipsterToken token;
    address owner = address(0x1);
    address user1 = address(0x2);
    address user2 = address(0x3);

    function setUp() public {
        // Деплой токена от имени owner
        vm.startPrank(owner);
        token = new TipsterToken();
        vm.stopPrank();
    }

    
    // Тесты начального состояния
    function testInitialSupply() public {
        assertEq(token.balanceOf(owner), 0);
        assertEq(token.totalSupply(), 0);
    }

    
    // Mint
    function testMintByMinter() public {
        vm.startPrank(owner);
        token.mint(user1, 500);
        vm.stopPrank();

        assertEq(token.balanceOf(user1), 500);
        assertEq(token.totalSupply(), 500);
    }

    function testMintFailsForNonMinter() public {
        vm.startPrank(user1);
        vm.expectRevert("AccessControlUnauthorizedAccount(0x0000000000000000000000000000000000000002, 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6)");
        token.mint(user1, 100);
        vm.stopPrank();
    }

    
    // Управление ролями
    function testGrantAndRevokeMinter() public {
        vm.startPrank(owner);
        token.grantMinter(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        token.mint(user2, 50);
        vm.stopPrank();

        assertEq(token.balanceOf(user2), 50);

        vm.startPrank(owner);
        token.revokeMinter(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert();
        token.mint(user2, 50);
        vm.stopPrank();
    }

    
    // Edge cases
    function testMintZeroFails() public {
        vm.startPrank(owner);
        vm.expectRevert("mint: amount = 0");
        token.mint(user1, 0);
        vm.stopPrank();
    }

    function testMintToZeroFails() public {
        vm.startPrank(owner);
        vm.expectRevert("mint: to = zero");
        token.mint(address(0), 100);
        vm.stopPrank();
    }
}

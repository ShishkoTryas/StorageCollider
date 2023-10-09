// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

abstract contract ArrayStorage {
    uint256[] private array;

    function collide() external virtual;

    function getArray() external view returns (uint256[] memory) {
        return array;
    }
}

library StorageLibrary {
    function collision(uint256 counter) external {
        require(counter >= 13 && counter < 100, "The value of the counter must be greater than 1 and less than 100.");
        assembly {
            sstore(0, counter)
        }
        for(uint256 i = 0; i <= counter; i++) {
            bytes32 location = keccak256(abi.encode(0));
            assembly{
                sstore(add(location, i), add(i,1))
            }
        }
    }
}

contract StorageCollider is ArrayStorage {
    function collide() external override {
        StorageLibrary.collision(20);
    }
    function colliedWithAnotherContract() external {
        (bool ok,) = address(new Collision()).delegatecall(abi.encodeWithSelector(Collision.pushArray.selector, 20));
        require(ok, "Something wrong");
    }
}

contract Collision {
    uint256[] public array;

    function pushArray(uint256 counter) external {
        require(counter >= 13 && counter < 100, "The value of the counter must be greater than 1 and less than 100.");
        for(uint256 i = 0; i < counter; i++) {
            array.push(i + 1);
        }
    }
}
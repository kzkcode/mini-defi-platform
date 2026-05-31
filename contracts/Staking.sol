// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Staking {
    using SafeERC20 for IERC20;

    IERC20 public token;
    uint256 public rewardRate; // wei per second
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public balances;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 private constant PRECISION = 1e30; // Increase precision to reduce rounding errors
    uint256 private _totalSupply;

    constructor(address _token) {
        token = IERC20(_token);

        // rewardRate for ~50% APR when totalStaked ≈ 300 MTK
        rewardRate = 4755000000000; // ≈ 0.000004755 MTK/sec

        lastUpdateTime = block.timestamp;
    }

    modifier updateReward(address account) {
        _updateReward(account);
        _;
    }

    function _updateReward(address account) internal {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;

        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) return rewardPerTokenStored;
        uint256 timeDelta = block.timestamp - lastUpdateTime;
        return rewardPerTokenStored + (timeDelta * rewardRate * PRECISION) / _totalSupply;
    }

    function deposit(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Cannot stake zero");
        balances[msg.sender] += amount;
        _totalSupply += amount;
        token.safeTransferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        _totalSupply -= amount;
        token.safeTransfer(msg.sender, amount);
    }

    function earned(address account) public view returns (uint256) {
        uint256 perTokenDelta = rewardPerToken() - userRewardPerTokenPaid[account];
        return rewards[account] + (balances[account] * perTokenDelta) / PRECISION;
    }

    function claimReward() external updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward == 0) return; // Safe if there is no reward
        rewards[msg.sender] = 0;
        token.safeTransfer(msg.sender, reward);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
}
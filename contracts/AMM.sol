// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPToken is ERC20 {
    address public amm;

    constructor() ERC20("MyToken LP", "MTK-LP") {
        amm = msg.sender;
    }

    function mint(address to, uint amount) external {
        require(msg.sender == amm, "only AMM");
        _mint(to, amount);
    }

    function burn(address from, uint amount) external {
        require(msg.sender == amm, "only AMM");
        _burn(from, amount);
    }
}

contract AMM {
    IERC20 public token;
    LPToken public lpToken;

    uint public reserveToken;
    uint public reserveETH;

    constructor(address _token) {
        token = IERC20(_token);
        lpToken = new LPToken();
    }

    receive() external payable {}

    // liquidity
    function addLiquidity(uint tokenAmount) external payable {
        require(tokenAmount > 0 && msg.value > 0, "invalid");

        if (reserveToken == 0 && reserveETH == 0) {
            token.transferFrom(msg.sender, address(this), tokenAmount);
            reserveToken = tokenAmount;
            reserveETH = msg.value;

            uint lpAmount = sqrt(tokenAmount * msg.value);
            lpToken.mint(msg.sender, lpAmount);
        } else {
            uint requiredETH = (reserveETH * tokenAmount) / reserveToken;
            require(msg.value >= requiredETH, "bad ratio");

            token.transferFrom(msg.sender, address(this), tokenAmount);

            uint lpAmount =
                (lpToken.totalSupply() * tokenAmount) / reserveToken;

            reserveToken += tokenAmount;
            reserveETH += msg.value;

            lpToken.mint(msg.sender, lpAmount);
        }
    }

    function removeLiquidity(uint lpAmount) external {
        uint totalLP = lpToken.totalSupply();

        uint tokenOut = (reserveToken * lpAmount) / totalLP;
        uint ethOut = (reserveETH * lpAmount) / totalLP;

        lpToken.burn(msg.sender, lpAmount);

        reserveToken -= tokenOut;
        reserveETH -= ethOut;

        token.transfer(msg.sender, tokenOut);

        (bool success, ) = msg.sender.call{value: ethOut}("");
        require(success, "ETH transfer failed");
    }

    // swap
    function swapTokenForETH(uint tokenIn, uint minETHOut) external {
        token.transferFrom(msg.sender, address(this), tokenIn);

        uint tokenInWithFee = (tokenIn * 997) / 1000;
        uint ethOut =
            (reserveETH * tokenInWithFee) /
            (reserveToken + tokenInWithFee);

        require(ethOut >= minETHOut, "slippage");

        reserveToken += tokenIn;
        reserveETH -= ethOut;

        (bool success, ) = msg.sender.call{value: ethOut}("");
        require(success, "ETH transfer failed");
    }

    function swapETHForToken(uint minTokenOut) external payable {
        uint ethInWithFee = (msg.value * 997) / 1000;
        uint tokenOut =
            (reserveToken * ethInWithFee) /
            (reserveETH + ethInWithFee);

        require(tokenOut >= minTokenOut, "slippage");

        reserveETH += msg.value;
        reserveToken -= tokenOut;

        token.transfer(msg.sender, tokenOut);
    }

    function sqrt(uint y) internal pure returns (uint z) {
            if (y > 3) {
                z = y;
                uint x = y / 2 + 1;
                while (x < z) {
                    z = x;
                    x = (y / x + x) / 2;
                }
            } else if (y != 0) {
                z = 1;
            }
        }
}
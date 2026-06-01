const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AMM", function () {
  let owner, user;
  let token, amm, lpToken;

  const INITIAL_SUPPLY = ethers.utils.parseEther("1000000");

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy ERC20
    const MyToken = await ethers.getContractFactory("MyToken");
    token = await MyToken.deploy(INITIAL_SUPPLY);
    await token.deployed();

    // Deploy AMM
    const AMM = await ethers.getContractFactory("AMM");
    amm = await AMM.deploy(token.address);
    await amm.deployed();

    // LP token
    const lpAddress = await amm.lpToken();
    lpToken = await ethers.getContractAt("LPToken", lpAddress);

    // Give user tokens
    await token.transfer(user.address, ethers.utils.parseEther("10000"));
  });

  it("initial state should be zero reserves", async function () {
    expect((await amm.reserveToken()).eq(ethers.constants.Zero)).to.be.true;
    expect((await amm.reserveETH()).eq(ethers.constants.Zero)).to.be.true;
  });

  it("addLiquidity: first provider mints LP tokens", async function () {
    const tokenAmount = ethers.utils.parseEther("1000");
    const ethAmount = ethers.utils.parseEther("10");

    await token.approve(amm.address, tokenAmount);

    await amm.addLiquidity(tokenAmount, { value: ethAmount });

    expect((await amm.reserveToken()).eq(tokenAmount)).to.be.true;
    expect((await amm.reserveETH()).eq(ethAmount)).to.be.true;

    const lpBalance = await lpToken.balanceOf(owner.address);
    expect(lpBalance.gt(ethers.constants.Zero)).to.be.true;
  });

  it("swapTokenForETH reduces AMM ETH reserve", async function () {
    // add liquidity
    await token.approve(amm.address, ethers.utils.parseEther("1000"));
    await amm.addLiquidity(
      ethers.utils.parseEther("1000"),
      { value: ethers.utils.parseEther("10") }
    );

    const reserveBefore = await amm.reserveETH();

    // user swaps
    await token.connect(user).approve(
      amm.address,
      ethers.utils.parseEther("100")
    );

    await amm.connect(user).swapTokenForETH(
      ethers.utils.parseEther("100"),
      0
    );

    const reserveAfter = await amm.reserveETH();
    expect(reserveAfter.lt(reserveBefore)).to.be.true;
  });

  it("removeLiquidity returns both token and ETH", async function () {
    const tokenAmount = ethers.utils.parseEther("1000");
    const ethAmount = ethers.utils.parseEther("10");

    await token.approve(amm.address, tokenAmount);
    await amm.addLiquidity(tokenAmount, { value: ethAmount });

    const lpBalance = await lpToken.balanceOf(owner.address);

    const tokenBefore = await token.balanceOf(owner.address);
    const ethBefore = await ethers.provider.getBalance(owner.address);

    const tx = await amm.removeLiquidity(lpBalance);
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    const tokenAfter = await token.balanceOf(owner.address);
    const ethAfter = await ethers.provider.getBalance(owner.address);

    // assets returned
    expect(tokenAfter.gt(tokenBefore)).to.be.true;
    expect(ethAfter.add(gasCost).gt(ethBefore)).to.be.true;

    // reserves cleared
    expect((await amm.reserveToken()).eq(ethers.constants.Zero)).to.be.true;
    expect((await amm.reserveETH()).eq(ethers.constants.Zero)).to.be.true;
  });
});
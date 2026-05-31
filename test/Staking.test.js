const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking Contract", function () {
  let Token, token, Staking, staking;
  let owner;

  const initialSupply = ethers.utils.parseEther("1000");
  const tolerance = ethers.utils.parseEther("0.00001");

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy(initialSupply);
    await token.deployed();

    Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(token.address);
    await staking.deployed();

    await token.approve(staking.address, initialSupply);
  });

  it("deposit increases balance", async function () {
    const amount = ethers.utils.parseEther("100");
    await staking.deposit(amount);

    const balance = await staking.balances(owner.address);
    const totalSupply = await staking.totalSupply();

    expect(balance.sub(amount).abs().lte(tolerance)).to.be.true;
    expect(totalSupply.sub(amount).abs().lte(tolerance)).to.be.true;
  });

  it("withdraw returns tokens and updates balances", async function () {
    const amount = ethers.utils.parseEther("100");
    await staking.deposit(amount);
    await staking.withdraw(amount);

    const balance = await staking.balances(owner.address);
    const totalSupply = await staking.totalSupply();

    expect(balance.abs().lte(tolerance)).to.be.true;
    expect(totalSupply.abs().lte(tolerance)).to.be.true;
  });

  it("reward increases over time within tolerance", async function () {
    const amount = ethers.utils.parseEther("100");
    await staking.deposit(amount);

    const rewardRate = await staking.rewardRate();

    await ethers.provider.send("evm_increaseTime", [10]);
    await ethers.provider.send("evm_mine");

    const reward = await staking.earned(owner.address);
    const expected = rewardRate.mul(10);

    expect(reward.sub(expected).abs().lte(tolerance)).to.be.true;
  });

  it("claimReward transfers correct reward within tolerance", async function () {
    const amount = ethers.utils.parseEther("100");
    await staking.deposit(amount);

    await ethers.provider.send("evm_increaseTime", [10]);
    await ethers.provider.send("evm_mine");

    const expected = await staking.earned(owner.address);

    const before = await token.balanceOf(owner.address);
    await staking.claimReward();
    const after = await token.balanceOf(owner.address);

    const reward = after.sub(before);

    expect(reward.sub(expected).abs().lte(tolerance)).to.be.true;
  });

  it("multiple deposits accumulate correctly", async function () {
    const amount1 = ethers.utils.parseEther("50");
    const amount2 = ethers.utils.parseEther("30");

    await staking.deposit(amount1);

    await ethers.provider.send("evm_increaseTime", [5]);
    await ethers.provider.send("evm_mine");

    await staking.deposit(amount2);

    const totalBalance = await staking.balances(owner.address);
    const expected = amount1.add(amount2);

    expect(totalBalance.sub(expected).abs().lte(tolerance)).to.be.true;
  });
});
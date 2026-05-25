const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let Token, token, owner, addr1, addr2;
  const initialSupply = 1000000; // Will be multiplied by 10**18 in Solidity

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy(initialSupply);
    await token.deployed();
  });

  it("should assign the initial balance to the owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance.toString()).to.equal(
      ethers.utils.parseUnits(initialSupply.toString(), 18).toString()
    );
  });

  it("should transfer tokens correctly", async function () {
    const amount = ethers.utils.parseUnits("100", 18); // 100 MTK
    await token.transfer(addr1.address, amount);

    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance.toString()).to.equal(amount.toString());
  });

  it("should handle approve and transferFrom correctly", async function () {
    const allowanceAmount = ethers.utils.parseUnits("100", 18); // 100 MTK

    // Owner approves addr1 to spend tokens
    await token.approve(addr1.address, allowanceAmount);
    const allowance = await token.allowance(owner.address, addr1.address);
    expect(allowance.toString()).to.equal(allowanceAmount.toString());

    // addr1 transfers tokens from owner to addr2
    await token.connect(addr1).transferFrom(owner.address, addr2.address, allowanceAmount);
    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance.toString()).to.equal(allowanceAmount.toString());
  });
});
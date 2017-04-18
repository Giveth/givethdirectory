var GivethDirectory = artifacts.require("./GivethDirectory.sol");

module.exports = function(deployer) {
  deployer.deploy(GivethDirectory);
};

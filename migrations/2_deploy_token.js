const erc20_token_template = artifacts.require("./ERC20TokenTemplate.sol");
const erc20_token_vendor = artifacts.require("./ERC20TokenVendor.sol");

module.exports = function(deployer) {
    var name = "MatanKoins";
    var symbol = "MTK"
    var totalSupply = "100000000000000000000";
    deployer.deploy(erc20_token_template, name, symbol, totalSupply)
    
    .then(() => deployer.deploy(erc20_token_vendor, erc20_token_template.address, 5));
};

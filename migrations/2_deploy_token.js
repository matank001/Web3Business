const erc20_token_template = artifacts.require("./ERC20TokenTemplate.sol");

module.exports = function(deployer) {
    var name = "MatanKoins";
    var symbol = "MTK"
    var totalSupply = 100000;
    deployer.deploy(erc20_token_template, name, symbol, totalSupply);
};

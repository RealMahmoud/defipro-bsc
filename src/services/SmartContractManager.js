const erc20Artifacts = require("../../contracts/ERC20");
const matchingMarketArtifacts = require("../../contracts/MatchingMarket");

export default class SmartContractManager {
  constructor(web3) {
    this.web3 = web3;
  }

  deployContract(
    contract,
    sender,
    code,
    args,
    sendTransactionCallBack,
    receiptCallback,
    deployedCallback
  ) {
    contract
      .deploy({
        data: code,
        arguments: args
      })
      .send({ from: sender }, sendTransactionCallBack)
      .on("receipt", receiptCallback)
      .then(deployedCallback);
  }

  getErcInstanceFromAddress(sender, address) {
    return new this.web3.eth.Contract(erc20Artifacts.abi, address, {
      from: sender
    });
  }

  getMatchingMarketInstanceFromAddress(sender, address) {
    return new this.web3.eth.Contract(matchingMarketArtifacts.abi, address, {
      from: sender
    });
  }

  async getErc20Info(instance) {
    const name = await instance.methods.name().call();
    console.log("name: ", name);
    const symbol = await instance.methods.symbol().call();
    const totalSupply = await instance.methods.totalSupply().call();
    return {
      name: name,
      symbol: symbol,
      totalSupply: totalSupply
    };
  }

  getMatchingMarketArtifacts() {
    return matchingMarketArtifacts;
  }

  newMatchingMarketContract(address = null) {
    return new this.web3.eth.Contract(matchingMarketArtifacts.abi, address);
  }
}

export default class SmartContractManager {
    constructor() {
    }

    deployContract(contract, sender, code, args, sendTransactionCallBack, receiptCallback, deployedCallback) {
        contract.deploy({
            data: code,
            arguments: args,
        })
            .send({from: sender,}, sendTransactionCallBack)
            .on('receipt', receiptCallback)
            .then(deployedCallback);
    }
}

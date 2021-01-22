const chai = require('chai');
const expect = chai.expect;
const Web3 = require('web3');
const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
const rpcEndpoint = 'https://rpc.goerli.mudit.blog/';
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));
const contractAbi = require('../contracts/MatchingMarket').abi;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const contractAddress = '0x7d8352C5a50bB7a83e9C4e20898E88C75b6ae358'
const matchingMarketContract = new web3.eth.Contract(contractAbi, contractAddress, {});

describe('Init', function () {
    describe('#start()', function () {
        it('should start normally', async function () {
            const name = await matchingMarketContract.methods.name().call({from: account.address});
            console.log(name);
            matchingMarketContract.methods.make(
                '0x619A83c9368aDa9fFb98c3F14b662724dD19E943',
                '0xbBCeB59101A8399DB5e1dB03323BE7b00fEEF004',
                10,
                10
            )
                .send({from: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73'})
                .on('receipt', console.log)
                .on('error', console.error);
        });
    });
});

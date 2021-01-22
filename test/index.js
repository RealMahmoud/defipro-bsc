const chai = require('chai');
const expect = chai.expect;
const Web3 = require('web3');
const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
const rpcEndpoint = 'http://127.0.0.1:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));
const contractAbi = require('../contracts/MatchingMarket').abi;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const contractAddress = '0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e'
const matchingMarketContract = new web3.eth.Contract(contractAbi, contractAddress, {});

describe('Init', function () {
    describe('#start()', function () {
        it('should start normally', async function () {
            const name = await matchingMarketContract.methods.name().call({from: account.address});
            console.log(name);
            matchingMarketContract.methods.make(
                '0x42699A7612A82f1d9C36148af9C77354759b210b',
                '0xa50a51c09a5c451C52BB714527E1974b686D8e77',
                10,
                10
            )
                .send({from: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73'})
                .on('receipt', console.log)
                .on('error', console.error);
        });
    });
});

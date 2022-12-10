const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());
const initialMessage = 'Hello World!';
const updatedMessage = 'Bye World!';
let accounts;
let inbox;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode, arguments: [ initialMessage ] })
      .send({ from: accounts[0], gas: "1000000" });
});

describe('contract Inbox', () => {
    it('should deploys a contract', () => {
        assert.ok(inbox.options.address);
    });
    it('should have a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, initialMessage);
    });
    it('should change the message', async () => {
        await inbox.methods
          .setMessage(updatedMessage)
          .send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, updatedMessage);
    })
});
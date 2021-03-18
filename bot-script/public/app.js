import { Client, PrivateKey } from 'dsteem';
import { Test as TestConfig } from '../../configuration';
import dataAccount from '../../dataAccount';

//info about bot account
const data = dataAccount.account;
//Accounts list to vote
const accountsList = TestConfig.followAccounts;

const client = Client(followAccounts.url);
let blocks = [];
let stream;
let transactions = [];
let blockObject = {};

const createPrivateKey = function() {
    try {
        return PrivateKey.fromString(data.privActive);
    } catch (e) {
        console.log(e.message + ' - See console for full error.');
        throw e;
    }
};

const listenBlocks = async ()=>{
    stream = client.Blockchain.getBlockStream();
    stream
        .on('data', block => {
            blockObject.block_id = block.block_id;
            transactions = block.transactions.filter((transaction)=>{
                let val = (transaction == 'blog'|| transaction == 'comment') ? 
                    (accountsList.contains(transaction.author)) ? true : false : false;
                return val;
            });
            blockObject.transactions = block.transactions
            transactions.forEach(transaction => {
                vote(transaction.author,transaction.permlink)
            });
            (transactions===[]) ? blocks.unshift(
                `<div class="list-group-item"><h5 class="list-group-item-heading">Block id: ${
                    block.block_id
                }</h5></div>`
            ): '';
            document.getElementById('Content').innerHTML = blocks.join(' ')
        })
        .on('end', function() {
            console.log('END');
        });
}
listenBlocks().catch(console.error);

async function vote (author,permlink) {
    const voter = data.address;
    const privateKey = createPrivateKey();
    const author = document.getElementById('author').value;
    const permlink = document.getElementById('permlink').value;
    const weight = parseInt(10);
    //create vote object
    const vote = {
        voter,
        author,
        permlink,
        weight, //needs to be an integer for the vote function
    };
    //broadcast the vote
    client.broadcast.vote(vote, privateKey).then(
        function(result) {
            console.log('success:', result);
        },
        function(error) {
            console.log('error:', error);
        }
    );
}
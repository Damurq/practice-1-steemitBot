import { Client, PrivateKey } from 'dsteem';
import { Test as TestConfig } from '../../configuration';
import dataAccount from '../../dataAccount';

//info about bot account
const data = dataAccount.account;
//Accounts list to vote
const accountsList = TestConfig.followAccounts;

const client = new Client(TestConfig.url);
let stream;
let transactions = [];
let html = '';

const createPrivateKey = function() {
    try {
        return PrivateKey.fromString(data.privActive);
    } catch (e) {
        console.log(e.message + ' - See console for full error.');
        throw e;
    }
};

async function listenBlocks () {
    stream = client.blockchain.getBlockStream();
    stream
        .on('data', block => {
            block.transactions.forEach((transaction)=>{
                //I review each transaction in the block and if this is a blos a comment I review the author
                (transaction.operations[0][0] == 'comment') ? 
                    (accountsList.indexOf(transaction.operations[0][1].author)!==-1) ? transactions.unshift({
                    blockId: block.block_id,
                    author:transaction.operations[0][1].author,
                    permlink:transaction.operations[0][1].permlink
                }) : "" : "";
            });
            html = (transactions.length!==0) ?
                `<div class="list-group-item"><h5 class="list-group-item-heading">Block id: ${
                    block.block_id
                }</h5></div>
                <div id="${block.block_id}">
                </div>`
            : '';
            document.getElementById('Block').innerHTML+=html;
            transactions.forEach(transaction => {
                vote(transaction)
            });
            transactions =[];
        })
        .on('end', function() {
            console.log('END');
        });
}
listenBlocks().catch(console.error);

async function vote (transaction) {
    const voter = data.address;
    const privateKey = createPrivateKey();
    const author = transaction.author;
    const permlink = transaction.permlink;
    const weight = 1000;
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
            document.getElementById(transaction.blockId).innerHTML="vote id: :"+ result.id;
        },
        function(error) {
            console.log('error:', error);
            document.getElementById(transaction.blockId).innerHTML=error;
        }
    );
}
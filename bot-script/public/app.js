import { Client, PrivateKey } from 'dsteem';
import { Test as TestConfig } from '../../configuration';
import dataAccount from '../../dataAccount';

const data = dataAccount.account;
const listAccount = [
    "erpirio",
    "meryju79",
    "juan19",
    "dilcia"
]
const client = Client("https://api.steemit.com");
let blocks = [];
let stream;
let transactions = [];
let blockObject = {
    block_id= "",
    transactions = [],
};

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
                    (listAccount.contains(transaction.author)) ? true : false : false;
                return val;
            });
            transactions.forEach(transaction => {
                vote(transaction.author,transaction.permlink)
            });
            blocks.unshift(blockObject);

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
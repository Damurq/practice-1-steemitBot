import { Client, PrivateKey } from 'dsteem';
import { Test as TestConfig } from '../../configuration';
import dataAccount from '../../dataAccount';

//info about bot account
const data = dataAccount.account;
//Accounts list to vote
const accountsList = TestConfig.followAccounts;

const client = Client(followAccounts.url);
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

const listenBlocks = async ()=>{
    stream = client.Blockchain.getBlockStream();
    stream
        .on('data', block => {
            transactions = block.transactions.filter((transaction)=>{
                //Reviso cada transaccion en el bloque y si esta es un blos un comentario reviso el autor
                let val = (transaction == 'blog'|| transaction == 'comment') ? 
                    (accountsList.contains(transaction.author)) ? true : false : false;               
                return val;
            });
            html = (transactions!==[]) ?
                `<div class="list-group-item"><h5 class="list-group-item-heading">Block id: ${
                    block.block_id
                }</h5></div>
                <div id=${block.block_id}>
                </div>`
            : '';
            document.getElementById('Block').innerHTML.concat(html);
            transactions.forEach(transaction => {
                vote(block.block_id,transaction.author,transaction.permlink)
            });
        })
        .on('end', function() {
            console.log('END');
        });
}
listenBlocks().catch(console.error);

async function vote (blockId,authorP,permlinkP) {
    const voter = data.address;
    const privateKey = createPrivateKey();
    const author = authorP;
    const permlink = permlinkP;
    const weight = 10;
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
            document.getElementById(blockId).innerHTML.concat(result);
        },
        function(error) {
            console.log('error:', error);
            document.getElementById(blockId).innerHTML.concat(error);
        }
    );
}
# Voting bot

## Intro

This bot was designed to listen to the Steem blockchain and vote for the comments or blog made by specific accounts

## Structure

#### 1. Data

The bot is responsible for reading the data from two files that must be located in the root folder

The configuration.js file has the following structure:

```javascript
export const Test = {
    followAccounts: [
        "",
        "",
        "",
        ""
    ],
    url: 'https://api.steemit.com',
    net: {
        addressPrefix: 'STM',
        chainId:
            '0000000000000000000000000000000000000000000000000000000000000000',
    },
};
```
followAccounts is a list of the names of the accounts, this list will be used to determine if any of those accounts made a comment or post to vote for it.

The dataAccount.json file has the following structure:

```json
{
    "account": {
        "address": "",
        "privActive": ""
    }
}
```

"address" is the name of the account
"privActive" is the private key

#### 1.The bot

The bot executes the "listenBlocks" function, it listens to the generated blocks and in case any transaction was a post or a comment, it proceeds to verify if the author is one of those included in the "configuration.js" file, if applicable. thus it stores the necessary data in an object which in turn will be sent to a list called "transactions".

Once all the transactions in a block have been reviewed, a foreach is performed where the vote function is executed in each of the transactions that met the requirements


### To Run  

1.  clone this repo
1.  `cd `
1.  `npm i`
1.  `npm run dev-server` or `npm run start`
1.  After a few moments, the server should be running at [http://localhost:3000/](http://localhost:3000/)




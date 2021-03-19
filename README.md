# Bot para votar

## Intro

Este bot fue diseñado para escuchar la cadena de bloques Steem y votar por los comentario o blog realizados por unas cuentas especificas

## Estructura

#### 1. Datos

El bot se encarga de leer los datos de dos archivos que deben estar ubicados en la carpeta raíz

El archivo configuration.js tiene la siguiente estructura:

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
followAccounts es una lista de los nombres de las cuentas, esta lista será usada para determinar si alguna de esas cuentas realizo un comentario o post para votar por ella.

El archivo dataAccount.json tiene la siguiente estructura:

```json
{
    "account": {
        "address": "",
        "privActive": ""
    }
}
```

address es el nombre de la cuenta 
privActive es la clave privada

#### 1. El bot

El bot ejecuta la función "listenBlocks" esta escucha los bloques generados y en caso de que alguna transacción fuera un post o un comentario procede a verificar si el autor es alguno de los  incluidos en el archivo "configuration.js" , en caso de ser así almacena los datos necesarios en un objeto que a su vez será enviado a una lista llamada "transactions".

Una vez que se revisaron todas las transacciones de un bloque se realiza un foreach donde se ejecuta la función vote en cada una de las transacciones que cumplieron los requisitos


### To Run  

1.  clone this repo
1.  `cd `
1.  `npm i`
1.  `npm run dev-server` or `npm run start`
1.  After a few moments, the server should be running at [http://localhost:3000/](http://localhost:3000/)




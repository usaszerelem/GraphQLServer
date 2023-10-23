import express, { Express } from 'express';
import { AppEnv, Env } from './utils/AppEnv';
import { Server as HttpServer } from 'http';
import { ServerInit } from './startup/serverInit';

// ---------------------------------------------------------
// Global variables and type declarations

const app: Express = express();

var server: HttpServer<any, any> | undefined = undefined;

type AddressInfo = {
    address: string;
    family: string;
    port: number;
};

ServerInit(app);

const port = parseInt(AppEnv.Get(Env.PORT));

server = app.listen(port, () => {
    console.log('now listening');
});

console.log(getServerAddress(server.address() as AddressInfo));

function getServerAddress(addrInfo: AddressInfo) {
    if (addrInfo?.address === '::') {
        addrInfo.address = 'localhost';
    }
    return `http://${addrInfo.address}:${addrInfo.port}`;
}

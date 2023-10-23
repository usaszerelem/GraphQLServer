import { Express } from 'express';
import { InitGraphQL } from './InitGraphQL';
import { InitDatabase } from './database';

export async function ServerInit(expApp: Express): Promise<void> {
    InitGraphQL(expApp);

    console.log('Loading: ./startup/database');
    await InitDatabase();
}

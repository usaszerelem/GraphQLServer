import { Express } from 'express';
import { InitGraphQL } from './InitGraphQL';
import { InitDatabase } from './database';
import cors from 'cors';

export async function ServerInit(expApp: Express): Promise<void> {
    // Allow cross-origin requests
    expApp.use(cors());

    InitGraphQL(expApp);

    console.log('Loading: ./startup/database');
    await InitDatabase();
}

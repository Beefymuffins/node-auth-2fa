import { client } from '../public/db.js';

export const session = client.db('Node-Auth').collection('session');

session.createIndex({ sessionToken: 1 });

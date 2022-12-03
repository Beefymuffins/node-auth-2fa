import { client } from '../public/db.js';

export const user = client.db('Node-Auth').collection('user');

user.createIndex({ 'email.address': 1 });

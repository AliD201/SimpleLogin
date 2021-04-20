const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'SWE545',
        database: 'DhahranEShopping'
    }
});
var pwd = "12345678"
var crypto = require('crypto');
const { connected } = require('process');
var hash = crypto.createHash('sha256').update(pwd).digest('hex');
console.log(pwd)
console.log(hash)
console.log(new Date())
var rnd = Math.floor(Math.random() * (10000 - 999)) + 999
console.log(rnd)
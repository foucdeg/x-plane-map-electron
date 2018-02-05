const net = require('net');

const server = new net.Server();
server.listen(process.argv[2]);

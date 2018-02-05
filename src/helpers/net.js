const net = require('net');

export default function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const tester = net.createServer()
      .once('error', (err) => {
        if (err.code !== 'EADDRINUSE') return reject(err);
        return resolve(false);
      })
      .once('listening', () => {
        tester.once('close', () => { resolve(true); }).close();
      })
      .listen(port);
  });
}

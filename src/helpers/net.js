const net = require('net');

export default function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    if (port < 1024) return resolve(false);
    const tester = net.createServer()
      .once('error', (err) => {
        if (err.code !== 'EADDRINUSE') return reject(err);
        return resolve(false);
      })
      .once('listening', () => {
        tester.once('close', () => { resolve(true); }).close();
      })
      .listen(port);
    return true;
  });
}

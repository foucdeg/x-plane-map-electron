const dgram = require('dgram');

export default class UDPListener {
  constructor(planeList) {
    this.planeList = planeList;
    this.server = dgram.createSocket('udp4');

    this.server.on('error', (err) => {
      console.error(`UPD error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      if (msg.readInt8(5) === 20) {
        if (!this.planeList[rinfo.address]) this.planeList[rinfo.address] = {}

        this.planeList[rinfo.address].lat = msg.readFloatLE(9);
        this.planeList[rinfo.address].lon = msg.readFloatLE(13);
        this.planeList[rinfo.address].alt = msg.readFloatLE(17);
      }
    });

    this.server.on('listening', () => {
      var address = this.server.address();
      console.log(`UDP client listening on ${address.address}:${address.port}`);
    });
  }

  listen(port) {
    this.server.bind(port);
  }
}

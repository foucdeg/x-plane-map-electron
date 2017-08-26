const dgram = require('dgram');
const ip = process.env.TARGET_IP;
const port = process.env.TARGET_PORT || 49003;

let i = 0;
const lonOffset = 4 * Math.random();
const socket = dgram.createSocket('udp4');

setInterval(sendDatagram, 50);

function sendDatagram() {
  i++;
  let longitude = lonOffset + 4 * Math.cos(i / 4000.0);
  let latitude = 45 + 2 * Math.sin(i / 4000.0);
  let altitude = 25000 + 20000 * Math.sin(i / 400.0);

  let startBuffer = Buffer.from([68,65,84,65,60,20,0,0,0]);
  let endBuffer = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

  let latBuffer = new Buffer(4);
  latBuffer.writeFloatLE(latitude);

  let lonBuffer = new Buffer(4);
  lonBuffer.writeFloatLE(longitude);

  let altBuffer = new Buffer(4);
  altBuffer.writeFloatLE(altitude);

  let finalBuffer = Buffer.concat([startBuffer, latBuffer, lonBuffer, altBuffer, endBuffer]);
  socket.send(finalBuffer, port, ip);
}

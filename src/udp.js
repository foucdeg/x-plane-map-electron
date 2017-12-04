/* eslint no-console: "off", no-mixed-operators: "off" */
const dgram = require('dgram');
const geolib = require('geolib');

const historyLength = 50;

export default class UDPListener {
  static readMessage(message) {
    return {
      latitude: message.readFloatLE(9),
      longitude: message.readFloatLE(13),
      altitude: message.readFloatLE(17),
      date: Date.now(),
    };
  }

  static calculateSpeed(from, to) {
    if (!from) return 0;
    const distanceInMeters = geolib.getDistance(from, to, 1);
    const deltaTInMilliseconds = to.date - from.date;
    const speedInMS = 1000 * distanceInMeters / deltaTInMilliseconds;
    return speedInMS * 3600 / 1852;
  }

  static calculateBearing(from, to) {
    if (!from) return 0;
    return geolib.getRhumbLineBearing(from, to);
  }

  constructor(planeList) {
    this.planeList = planeList;
    this.server = dgram.createSocket('udp4');

    this.server.on('error', (err) => {
      console.error(`UPD error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      if (msg.readInt8(5) === 20) {
        const newLocation = UDPListener.readMessage(msg);
        this.updatePosition(rinfo.address, newLocation);
      }
    });

    this.listening = false;

    setInterval(this.cleanOutdatedPlanes.bind(this), 1000);
  }

  updatePosition(ip, newLocation) {
    const planeInfo = this.planeList[ip] || {};
    Object.assign(planeInfo, newLocation);

    if (!planeInfo.positionHistory) planeInfo.positionHistory = [];
    if (!planeInfo.name) planeInfo.name = ip;
    if (!planeInfo.icon) planeInfo.icon = 'airliner';

    planeInfo.positionHistory.unshift(newLocation);
    while (planeInfo.positionHistory.length > historyLength) planeInfo.positionHistory.pop();

    planeInfo.heading = UDPListener.calculateBearing(
      planeInfo.positionHistory[1],
      planeInfo.positionHistory[0],
    );
    planeInfo.speed = UDPListener.calculateSpeed(
      planeInfo.positionHistory[historyLength - 1],
      planeInfo.positionHistory[0],
    );

    this.planeList[ip] = planeInfo;
  }

  listen(port) {
    this.stopListening(() => {
      this.server.bind(port, null, () => {
        this.listening = true;
        console.log(`UDP client now listening on port ${port}`);
      });
    });
  }

  stopListening(callback) {
    if (this.listening) {
      this.server.close(() => {
        this.server = dgram.createSocket('udp4');
        this.listening = false;
        if (callback) callback();
      });
    } else if (callback) callback();
  }

  cleanOutdatedPlanes() {
    Object.keys(this.planeList).forEach((ip) => {
      const latestPositionDate = this.planeList[ip].positionHistory[0].date;
      // if latest known position is older than 30s
      if ((Date.now() - latestPositionDate) > 30000) {
        // assume they crashed and call 911
        delete this.planeList[ip];
      }
    });
  }
}

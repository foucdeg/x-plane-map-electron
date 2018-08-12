/* eslint no-console: "off", no-mixed-operators: "off" */
import dgram from 'dgram';
import geolib from 'geolib';
import last from 'lodash/last';

const HISTORY_DURATION = 5000;

export default class UDPListener {
  static readMessage(message) {
    // See http://www.nuclearprojects.com/xplane/xplaneref.html
    let i = 5;
    while (i + 36 <= message.length) {
      if (message.readInt8(i) === 20) {
        return {
          latitude: message.readFloatLE(i + 4),
          longitude: message.readFloatLE(i + 8),
          altitude: message.readFloatLE(i + 12),
          date: Date.now(),
        };
      }
      i += 36;
    }
    return null;
  }

  static calculateSpeed(from, to) {
    if (!from || !to) return 0;
    const distanceInMeters = geolib.getDistance(from, to, 1);
    const deltaTInMilliseconds = to.date - from.date;
    const speedInMS = 1000 * distanceInMeters / deltaTInMilliseconds;
    return speedInMS * 3600 / 1852;
  }

  static calculateBearing(from, to) {
    if (!from) return 0;
    if (from.longitude === to.longitude && from.latitude === to.latitude) {
      throw new Error('No bearing');
    }
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
      const newLocation = UDPListener.readMessage(msg);
      this.updatePosition(rinfo.address, newLocation);
    });

    this.listening = false;

    setInterval(this.cleanOutdatedPlanes.bind(this), 1000);
  }

  updatePosition(ip, newLocation) {
    if (!newLocation) return;
    const planeInfo = this.planeList[ip] || {};
    Object.assign(planeInfo, newLocation);

    if (!planeInfo.positionHistory) planeInfo.positionHistory = [];
    if (!planeInfo.name) planeInfo.name = ip;
    if (!planeInfo.icon) planeInfo.icon = 'airliner';
    if (!planeInfo.heading) planeInfo.heading = 0;
    if (!planeInfo.speed) planeInfo.speed = 0;

    planeInfo.positionHistory.unshift(newLocation);
    const now = Date.now();
    while (last(planeInfo.positionHistory).date < (now - HISTORY_DURATION)) {
      planeInfo.positionHistory.pop();
    }

    const from = planeInfo.positionHistory[planeInfo.positionHistory.length - 1];
    const to = planeInfo.positionHistory[0];

    try {
      planeInfo.heading = UDPListener.calculateBearing(from, to);
    } catch (e) {
      // keep previous heading
    }

    planeInfo.speed = UDPListener.calculateSpeed(from, to);

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
        console.log('UDP client no longer listening');
        if (callback) callback();
      });
    } else if (callback) callback();
  }

  cleanOutdatedPlanes() {
    Object.keys(this.planeList).forEach((ip) => {
      const latestPositionDate = this.planeList[ip].positionHistory[0].date;
      // if latest known position is older than 60s
      if ((Date.now() - latestPositionDate) > 60000) {
        // assume they crashed and call 911
        delete this.planeList[ip];
      }
    });
  }
}

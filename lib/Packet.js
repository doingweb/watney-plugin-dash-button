const { decoders } = require('cap');

module.exports = class Packet {
  constructor(buffer, byteCount) {
    this.buffer = buffer;
    this.byteCount = byteCount;

    this.ethernet = decoders.Ethernet(this.buffer);
    this.ipv4 = decoders.IPV4(this.buffer, this.ethernet.offset);
    this.udp = decoders.UDP(this.buffer, this.ipv4.offset);
  }

  get body() {
    return {
      toAscii: () =>
        this.buffer.toString('ascii', this.udp.offset, this.byteCount)
    };
  }

  get macAddress() {
    return this.ethernet.info.srcmac.toUpperCase();
  }
};

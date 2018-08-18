const { Cap } = require('cap');
const { EventEmitter } = require('events');
const Packet = require('./Packet');

const dashButtonPcapFilter = 'udp and src port 68 and dst port 67';

module.exports = class PacketCapture extends EventEmitter {
  /**
   * Creates an instance of PacketCapture.
   *
   * @param {string} networkInterface The ID of the network interface to capture on.
   * @param {number} [libpcapBufferSize=10 * 1024 * 1024] The size of the internal libpcap buffer.
   * @param {number} [packetBufferSize=65535] The size of the buffer for packets.
   */
  constructor(
    networkInterface,
    libpcapBufferSize = 10 * 1024 * 1024,
    packetBufferSize = 65535
  ) {
    super();

    this.networkInterface = networkInterface;
    this.libpcapBufferSize = libpcapBufferSize;
    this.packetBufferSize = packetBufferSize;
    this.buffer = null;
    this.byteCount = 0;
  }

  start() {
    this.buffer = Buffer.alloc(this.packetBufferSize);
    this.rawCapture = new Cap();

    this.rawCapture.open(
      this.networkInterface,
      dashButtonPcapFilter,
      this.libpcapBufferSize,
      this.buffer
    );
    this.rawCapture.setMinBytes && this.rawCapture.setMinBytes(0);

    this.rawCapture.on('packet', byteCount => {
      this.byteCount = byteCount;
      this.emitPacket();
    });
  }

  stop() {
    this.rawCapture.close();
  }

  emitPacket() {
    this.emit('packet', new Packet(this.buffer, this.byteCount));
  }
};

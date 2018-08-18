const PacketCapture = require('./PacketCapture');

module.exports = class ButtonDispatcher {
  /**
   * Builds the mac address -> button Map and gets the packet capture ready.
   *
   * @param Array<Button> buttons
   */
  constructor(buttons, captureInterface) {
    this.buttonsByMacAddress = new Map(buttons.map(b => [b.macAddress, b]));

    this.capture = new PacketCapture(captureInterface);

    this.capture.on('packet', packet => {
      const button = this.buttonsByMacAddress.get(packet.macAddress);

      if (button) {
        button.press();
      }
    });
  }

  listen() {
    this.capture.start();
  }
};

const PacketCapture = require('../lib/PacketCapture');

/**
 * Retrieved from https://www.macvendorlookup.com/search/Amazon%20Technologies
 */
const knownAmazonMacPrefixes = ['74:75:48', '74:C2:46', 'A0:02:DC'];

/**
 * CLI function that looks for Dash Buttons.
 *
 * Used to discover buttons during Watney configuration.
 *
 * @param {WatneyApp} app
 */
module.exports = async function findDashButtonsCli(app) {
  const { captureInterface } = app.plugins.get('dash-button').config;

  const capture = new PacketCapture(captureInterface);

  capture.on('packet', analyzePacket);

  capture.start();

  console.log('Listening... (Press any key to stop)');
  await anyKey();

  capture.stop();
};

function analyzePacket(packet) {
  if (hasAmazonMacAddress() || hasDashButtonChip()) {
    console.log(
      `Found a Dash button I think! MAC Address: ${packet.macAddress}`
    );
  }

  function hasAmazonMacAddress() {
    return knownAmazonMacPrefixes.includes(packet.macAddress.substring(0, 8));
  }

  function hasDashButtonChip() {
    return packet.body.toAscii().includes('WINC1500');
  }
}

function anyKey() {
  const { stdin } = process;
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise(resolve =>
    stdin.once('keypress', () => {
      stdin.setRawMode(false);
      resolve();
    })
  );
}

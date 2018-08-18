const { Cap } = require('cap');
const inquirer = require('inquirer');

const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

/**
 * CLI function for finding packet capture interfaces
 * for Watney configuration purposes.
 *
 * @param {WatneyApp} app
 */
module.exports = async function getCaptureInterfaceCli(app) {
  const deviceList = Cap.deviceList();

  const deviceChoices = deviceList
    .filter(
      d => d.addresses.length && d.addresses.some(a => a.addr.match(ipRegex))
    )
    .map(d => ({
      name: `${d.description} (${
        d.addresses.find(a => a.addr.match(ipRegex)).addr
      })`,
      value: d.name
    }));

  let { deviceId } = await inquirer.prompt({
    name: 'deviceId',
    message: 'Which device should we be listening for Dash buttons on?',
    type: 'list',
    choices: deviceChoices
  });

  console.log('Great! Now add the interface device ID to your config:');
  console.log('dash-button:');
  console.log(`  captureInterface: ${deviceId}`);
};

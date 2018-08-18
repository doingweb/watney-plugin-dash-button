const inquirer = require('inquirer');
const findDashButtonsCli = require('./find-dash-buttons');
const getCaptureInterfaceCli = require('./get-capture-interface');

module.exports = async function dashButtonCli(app) {
  const { config } = app.plugins.get('dash-button');

  const getCaptureInterfaceChoice = {
    name: 'Get capture interface',
    value: getCaptureInterfaceCli
  };

  const findDashButtonsChoice = {
    name: 'Find Dash buttons',
    value: findDashButtonsCli
  };

  let answers = await inquirer.prompt([
    {
      name: 'command',
      message: 'What would you like to do?',
      type: 'list',
      choices: [
        !config.captureInterface
          ? getCaptureInterfaceChoice
          : findDashButtonsChoice
      ]
    }
  ]);

  await answers.command(app);
};

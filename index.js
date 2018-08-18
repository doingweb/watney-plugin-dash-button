const { WatneyPlugin } = require('watney-app');
const events = require('./lib/events');
const DashButton = require('./lib/DashButton');
const ButtonDispatcher = require('./lib/ButtonDispatcher');

module.exports = class DashButtonPlugin extends WatneyPlugin {
  static get id() {
    return 'dash-button';
  }

  static get description() {
    return 'Plugin for Amazon Dash buttons.';
  }

  static get cli() {
    return require('./cli');
  }

  get events() {
    return events;
  }

  constructor(config) {
    super(config);

    this.buildButtonMap();
    this.setUpButtonLogging();

    this.logger.log('Plugin has been constructed.');
  }

  async init() {
    this.dispatcher = new ButtonDispatcher(
      Array.from(this.buttons.values()),
      this.config.captureInterface
    );
    this.dispatcher.listen();

    await super.init();
  }

  getButton(name) {
    return this.buttons.get(name);
  }

  getButtons(...names) {
    return names.map(name => this.buttons.get(name));
  }

  buildButtonMap() {
    this.buttons = new Map();

    if (!this.config.buttons) {
      return;
    }

    for (const [name, macAddress] of Object.entries(this.config.buttons)) {
      this.buttons.set(name, new DashButton(name, macAddress.toUpperCase()));
    }
  }

  setUpButtonLogging() {
    for (const button of this.buttons.values()) {
      button.on(events.BUTTON_PRESSED, () =>
        this.logger.log(`Button "${button.name}" was pressed!`)
      );
    }
  }
};

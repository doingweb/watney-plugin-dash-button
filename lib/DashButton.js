const { EventEmitter } = require('events');
const { BUTTON_PRESSED } = require('./events');

/**
 * An Amazon Dash button.
 *
 * @class Button
 * @event BUTTON_PRESSED The button has been pressed.
 */
module.exports = class DashButton extends EventEmitter {
  /**
   * Creates an instance of Button.
   */
  constructor(name, macAddress) {
    super();

    this.name = name;
    this.macAddress = macAddress;
  }

  press() {
    this.emit(BUTTON_PRESSED);
  }
};

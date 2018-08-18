Watney Amazon Dash Button Plugin
================================

[![Build Status](https://travis-ci.org/doingweb/watney-plugin-dash-button.svg?branch=master)](https://travis-ci.org/doingweb/watney-plugin-dash-button)
[![Greenkeeper badge](https://badges.greenkeeper.io/doingweb/watney-plugin-dash-button.svg)](https://greenkeeper.io/)

A Watney plugin for Amazon Dash buttons.

Designed around button model `JK29LP`.

**Note**: Experimental API. May go though some pretty wild changes before 1.x, as we figure out which ideas are good and which are really really bad.

Getting Started
---------------

The first step when working with Dash buttons is to connect them to your WiFi network. [Bahman's article "Hack the Amazon Dash Button (JK29LP) on macOS Sierra"](https://medium.com/@bahman./hack-the-amazon-dash-button-jk29lp-on-macos-sierra-fe8b2312a471) has a good summary of those steps, and includes some helpful instructions on getting the MAC address for your button, which we'll need for the Watney config.

If you don't already have libpcap and the libpcap dev packages (or [Npcap on Windows](https://nmap.org/npcap/)), those are a platform requirement for getting this plugin to work.

Once you have your packet capture library (libpcap) set up, The next step is to figure out which network interface we should listen for buttons on.

### Get capture interface

To get a capture interface ID, run the `dash-button` plugin's CLI:

```console
$ npm run cli
[watney-app] It's good to be home.
[hue] Plugin has been constructed.
[dash-button] Plugin has been constructed.
? Run command-line interface for plugin dash-button
? What would you like to do? Get capture interface
? Which device should we be listening for Dash buttons on? Microsoft (192.168.1.100)
Great! Now add the interface device ID to your config:
dash-button:
  captureInterface: \Device\NPF_{12345678-1234-1234-1234-123456789ABC}
? Return to plugins menu? No
$
```

Once you add the `captureInterface` to your Watney config for `dash-button`, you will be able to use the CLI again to listen for Dash buttons and identify them.

### Find Dash buttons

The goal of finding Dash buttons is to determine their MAC address. If you followed the instructions in the [Bahman article](https://medium.com/@bahman./hack-the-amazon-dash-button-jk29lp-on-macos-sierra-fe8b2312a471) and already have it/them, you can skip the CLI method and add them straight to your Watney config:

```yaml
dash-button:
  captureInterface: \Device\NPF_{12345678-1234-1234-1234-123456789ABC}
  buttons:
    doorbell: 00:00:00:00:00:00
    nightlight: 00:00:00:00:00:00
    party: 00:00:00:00:00:00
```

If you don't have the MAC addresses yet, have no fear! There's a CLI for just that:

```console
$ npm run cli
[watney-app] It's good to be home.
[hue] Plugin has been constructed.
[dash-button] Plugin has been constructed.
? Run command-line interface for plugin dash-button? What would you like to do? Find Dash buttons
Listening... (Press any key to stop)
Found a Dash button I think! MAC Address: 00:00:00:00:00:00
? Return to plugins menu? No
$
```

This CLI function starts up a packet capture session with the same settings used by the plugin, but instead of cross referencing the MAC address with the config settings and triggering events, it just reports the MAC addresses to the console.

Usage
-----

Now that we have a capture interface and the Dash buttons configured, we can use the plugin in a script to listen for events from the Dash buttons:

```js
let dashButton = app.plugins.get('dash-button');

const { BUTTON_PRESSED } = dashButton.events;

let [doorbell] = await dashButton.getButton('doorbell');

doorbell.on(BUTTON_PRESSED, () =>
  console.log('The doorbell was rung!')
);
```

TODO
----

* Improve config flow:
  * When no config:
    * Only CLI option "List packet capture interfaces"
  * When packet capture interface set:
    * Add "Find Dash buttons"
* The older button model?
* `libpcapBufferSize` and `packetBufferSize`

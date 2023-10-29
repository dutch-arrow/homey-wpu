'use strict';

const Homey = require('homey');

class WPUApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('WPU app has been initialized');
  }

}

module.exports = WPUApp;

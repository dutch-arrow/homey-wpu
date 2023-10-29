'use strict';

const { Driver } = require('homey');

class WPUDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('WPUDriver has been initialized');
  }

  async onPair(session) {
    this.log('OnPair()');
  }

}

module.exports = WPUDriver;

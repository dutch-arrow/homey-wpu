/* eslint-disable eqeqeq */

'use strict';

const Homey = require('homey');

const axios = require('axios');

class WPUDevice extends Homey.Device {

  /**
     * onInit is called when the device is initialized.
     */
  async onInit() {
    this.log(`WPUDevice has been initialized: ${this.getSetting('url')} ${this.getSetting('period')}`);
    this.url = this.getSetting('url'); // http://192.168.1.211/api.html?get=ithostatus
    this.period = this.getSetting('period');
    await this.offerData();
    this.timer = this.homey.setInterval(async () => {
      await this.offerData();
    }, this.period * 60000);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async offerData() {
    const instance = this;
    axios.get(this.url)
      .then(async (response) => {
        const wpudata = this.convertData(response.data);
        await this.setCapabilityValue('data-offered', JSON.stringify(wpudata));
      })
      .catch((error) => {
        instance.log('Data Request Error: ', error);
      });
  }

  /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
  async onAdded() {
    this.log('WPUDevice has been added');
    await this.offerData();
    this.timer = this.homey.setInterval(async () => {
      await this.offerData();
    }, this.period * 60000);
  }

  /**
     * onSettings is called when the user updates the device's settings.
     * @param {object} event the onSettings event data
     * @param {object} event.oldSettings The old settings object
     * @param {object} event.newSettings The new settings object
     * @param {string[]} event.changedKeys An array of keys changed since the previous version
     * @returns {Promise<string|void>} return a custom message that will be displayed
     */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log(`WPUDevice settings where changed: ${newSettings.url} ${newSettings.period}`);
    this.url = newSettings.url;
    this.period = newSettings.period;
    this.counter = this.period;
    await this.offerData();
    this.timer = this.homey.setInterval(async () => {
      await this.offerData();
    }, this.period * 60000);
  }

  /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
  async onRenamed(name) {
    this.log("WPUDevice was renamed to '", name, "'");
  }

  /**
     * onDeleted is called when the user deleted the device.
     */
  async onDeleted() {
    this.log('WPUDevice has been deleted');
  }

  convertData(data) {
    const wpudata = {};
    wpudata.temp_buiten = data['Outside temp (°C)'];
    wpudata.temp_tobron = data['Temp to source (°C)'];
    wpudata.temp_frombron = data['Temp from source (°C)'];
    wpudata.temp_cv_aanvoer = data['CV supply temp (°C)'];
    wpudata.temp_cv_retour = data['CV return temp (°C)'];
    wpudata.druk_cv = data['CV pressure (Bar)'];
    wpudata.flow_sensor = data['Flow sensor (lt_hr)'];
    wpudata.flow_bron = data['Source pump flow setpoint (l_h)'];
    wpudata.cv_pomp = data['Cv pump (%)'];
    wpudata.bron_pomp = data['Well pump (%)'];
    wpudata.warmte_vraag = data['Heat demand total (%)'];
    wpudata.boiler_temp_onder = data['Boiler temp down (°C)'];
    wpudata.boiler_temp_boven = data['Boiler temp up (°C)'];
    wpudata.boiler_pomp = data['Boiler pump (%)'];
    wpudata.compressor_stroom = data['Compressor current (A)'] * 230;
    wpudata.temp_kamer = data['Room temp (°C)'];
    wpudata.temp_kamer_vraag = data['Requested room temp (°C)'];
    return wpudata;
  }

}

module.exports = WPUDevice;

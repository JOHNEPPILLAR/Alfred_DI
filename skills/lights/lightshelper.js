/**
 * Setup includes
 */
const HueLights = require('node-hue-api');
const { HueApi } = require('node-hue-api');
const dotenv = require('dotenv');
const alfredHelper = require('../../helper.js');
const mockLights = require('./mockLights.json');
const mockLightGroups = require('./mockLightGroups.json');

dotenv.load(); // Load env vars

const { lightState } = HueLights;
const { HueBridgeIP, HueBridgeUser } = process.env;
const Hue = new HueApi(HueBridgeIP, HueBridgeUser);

/**
 * Skill: registerDevice
 */
exports.registerDevice = async function FnRegisterDevice(res) {
  // Send the register command to the Hue bridge
  try {
    const config = await Hue.config();
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, true, config); // Send response back to caller
    }
    return config;
  } catch (err) {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, false, err); // Send response back to caller
    }
    global.logger.error(`registerDevice: ${err}`);
    return err;
  }
};

/**
 * Skill: lights on/off
 */
exports.lightOnOff = async function FnLightOnOff(res, lightNumber, lightAction, brightness, x, y, ct) {
  let returnMessage;
  let returnState;

  // Validate input params and set state
  // if (typeof brightness === 'undefined' || brightness == null) { brightness = 100; }

  let state = lightState.create().off(); // Default off
  if (lightAction === 'on') {
    if (typeof ct !== 'undefined' && ct != null) {
      state = lightState.create().on().brightness(brightness).ct(ct);
    } else if ((typeof x !== 'undefined' && x != null) &&
                (typeof y !== 'undefined' && y != null)) {
      state = lightState.create().on().brightness(brightness).xy(x, y);
    } else {
      state = lightState.create().on().brightness(brightness);
    }
  }

  try {
    const lights = await Hue.setLightState(lightNumber, state);
    state = null; // DeAllocate state object

    if (lights) {
      returnState = true;
      returnMessage = `The light was turned ${lightAction}.`;
    } else {
      returnState = false;
      returnMessage = `There was an error turning the light ${lightAction}.`;
    }
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, returnState, returnMessage); // Send response back to caller
    }
    return returnMessage;
  } catch (err) {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, null, err); // Send response back to caller
    }
    global.logger.error(`lightOnOff: ${err}`);
    return err;
  }
};

/**
 * Skill: light group on/off
 */
exports.lightGroupOnOff = async function FnLightGroupOnOff(res, lightNumber, lightAction, brightness, x, y, ct) {
  let returnMessage;
  let returnState;

  // Validate input params and set state
  // if (typeof brightness === 'undefined' || brightness == null) { brightness = 100; }

  let state = lightState.create().off(); // Default off
  if (lightAction === 'on') {
    if (typeof ct !== 'undefined' && ct != null) {
      state = lightState.create().on().brightness(brightness).ct(ct);
    } else if ((typeof x !== 'undefined' && x != null) &&
                (typeof y !== 'undefined' && y != null)) {
      state = lightState.create().on().brightness(brightness).xy(x, y);
    } else {
      state = lightState.create().on().brightness(brightness);
    }
  }

  try {
    let lights = await Hue.setGroupLightState(lightNumber, state);
    state = null; // DeAllocate state object

    if (lights) {
      returnState = true;
      returnMessage = `The light group was turned ${lightAction}.`;
    } else {
      returnState = false;
      returnMessage = `There was an error turning the light group ${lightAction}.`;
    }
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, returnState, returnMessage); // Send response back to caller
    }
    lights = null; // DeAllocate state object
    return returnMessage;
  } catch (err) {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, null, err); // Send response back to caller
    }
    global.logger.error(`lightGroupOnOff: ${err}`);
    return err;
  }
};

/**
 * Skill: list lights
 */
exports.listLights = async function FnListLights(res) {
  if (process.env.environment === 'dev') {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, true, mockLights); // Send mock response back to caller
    }
    return mockLights;
  }
  if (process.env.environment !== 'dev') {
    try {
      const lights = await Hue.lights();
      if (typeof res !== 'undefined' && res !== null) {
        alfredHelper.sendResponse(res, true, lights); // Send response back to caller
      }
      return lights;
    } catch (err) {
      if (typeof res !== 'undefined' && res !== null) {
        alfredHelper.sendResponse(res, null, err); // Send response back to caller
      }
      global.logger.error(`listLights: ${err}`);
      return err;
    }
  }
};

/**
 * Skill: list light groups
 */
exports.listLightGroups = async function FnListLightGroups(res) {
  if (process.env.environment === 'dev') {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, true, mockLightGroups); // Send mock response back to caller
    }
    return mockLightGroups;
  }
  if (process.env.environment !== 'dev') {
    try {
      const lights = await Hue.groups();

      // Remove unwanted light groups from json
      const tidyLights = lights.filter(light => light.type === 'Room');

      if (typeof res !== 'undefined' && res !== null) {
        alfredHelper.sendResponse(res, true, tidyLights); // Send response back to caller
      }
      return lights;
    } catch (err) {
      if (typeof res !== 'undefined' && res !== null) {
        alfredHelper.sendResponse(res, null, err); // Send response back to caller
      }
      global.logger.error(`listLightGroups: ${err}`);
      return err;
    }
  }
};

/**
 * Skill: turn off all lights
 */
exports.allOff = async function FnAllOff(res) {
  let state = lightState.create().off();
  try {
    // Get a list of all the lights
    let lights = await Hue.lights();
    lights.lights.forEach((value) => {
      Hue.setLightState(value.id, state);
    });
    state = null; // DeAllocate state object
    lights = null; // DeAllocate lights object
    alfredHelper.sendResponse(res, true, 'Turned off all lights.'); // Send response back to caller
  } catch (err) {
    state = null; // DeAllocate state object
    alfredHelper.sendResponse(res, null, 'There was a problem turning off all the lights.');
    global.logger.error(`allOff Error: ${err}`);
    return err;
  }
};

/**
 * Skill: get scenes
 */
exports.scenes = async function FnScenes(res) {
  try {
    const lights = await Hue.scenes();

    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, true, lights); // Send response back to caller
    }
    return lights;
  } catch (err) {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, null, err); // Send response back to caller
    }
    global.logger.error(`scenes: ${err}`);
    return err;
  }
};

/**
 * Skill: get sensor details
 */
exports.sensor = async function FnSensor(res) {
  try {
    const sensors = await Hue.sensors();

    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, true, sensors); // Send response back to caller
    } else {
      return sensors;
    }
  } catch (err) {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, null, err); // Send response back to caller
    } else {
      return err;
    }
    global.logger.error(`scenes: ${err}`);
  }
};

/**
 * Skill: get light details
 */
exports.lightstate = async function FnLightstate(res, lightNumber) {
  try {
    const state = await Hue.lightStatus(lightNumber);

    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, true, state); // Send response back to caller
    } else {
      return state;
    }
  } catch (err) {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, null, err); // Send response back to caller
    } else {
      return err;
    }
    global.logger.error(`lightstate: ${err}`);
  }
};

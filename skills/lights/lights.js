/**
 * Setup includes
 */
const Skills = require('restify-router').Router;
const lightshelper = require('./lightshelper.js');
const alfredHelper = require('../../helper.js');

const skill = new Skills();

/**
 * @api {get} /lights/registerdevice Register API server with HUE bridge
 * @apiName registerdevice
 * @apiGroup Lights
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTPS/1.1 200 OK
 *   {
 *     sucess: 'true'
 *     data: Hue bridge API response
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTPS/1.1 500 Internal error
 *   {
 *     data: Error message
 *   }
 *
 */
async function registerDevice(req, res, next) {
  logger.info('Register Device API called');
  await lightshelper.registerDevice(res);
  next();
}
skill.get('/registerdevice', registerDevice);

/**
 * @api {put} /lights/lightonoff Turn lights on or off
 * @apiName lightonoff
 * @apiGroup Lights
 *
 * @apiParam {Number} light_number Hue bridge light number
 * @apiParam {String} light_status [ on, off ]
 * @apiParam {Number} brightness Brighness [ 0..255 ]
 * @apiParam {Number} x Hue xy color [ 0..1 ]
 * @apiParam {Number} y Hue xy color [ 0..1 ]
 * @apiParam {Number} ct Hue ct color [153..500 ]
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTPS/1.1 200 OK
 *   {
 *     sucess: 'true'
 *     data: "The light was turned on."
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTPS/1.1 500 Internal error
 *   {
 *     data: Error message
 *   }
 *
 */
async function lightOnOff(req, res, next) {
  lastFnCall = 'lightOnOff';
  logger.info('Light on/off API called');
  let paramsOK = false;

  if ((typeof req.body.light_number !== 'undefined' && req.body.light_number !== null) ||
        (typeof req.body.light_status !== 'undefined' && req.body.light_status !== null) ||
        (typeof req.body.brightness !== 'undefined' && req.body.brightness !== null)) {
    paramsOK = true;
  }
  if (paramsOK) {
    switch (req.body.light_status.toLowerCase()) {
      case 'on':
        paramsOK = true;
        break;
      case 'off':
        paramsOK = true;
        break;
      default:
        paramsOK = false;
    }
  }
  if (paramsOK) {
    let {
      brightness, x, y, ct,
    } = req.body;
    if (brightness < 0) { brightness = 0; }
    if (brightness > 255) { brightness = 255; }
    if (typeof x !== 'undefined' && x !== null) {
      if (x < 0) { x = 0; }
      if (x > 1) { x = 1; }
    }
    if (typeof y !== 'undefined' && y !== null) {
      if (y < 0) { y = 0; }
      if (y > 1) { y = 1; }
    }
    if (typeof ct !== 'undefined' && ct !== null) {
      if (ct < 153) { ct = 153; }
      if (ct > 500) { ct = 500; }
    }
    await lightshelper.lightOnOff(res, req.body.light_number, req.body.light_status.toLowerCase(), brightness, x, y, ct);
  } else {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, false, 'The parameters light_status, light_number or percentage was either not supplied or invalid.');
    }
    logger.info('lightOnOff: The parameters light_status, light_number or percentage was either not supplied or invalid.');
  }
  next();
}
skill.put('/lightonoff', lightOnOff);

/**
 * @api {put} /lights/lightgrouponoff Turn light group on or off
 * @apiName lightonoff
 * @apiGroup Lights
 *
 * @apiParam {Number} light_number Hue bridge light group number
 * @apiParam {String} light_status [ on, off ]
 * @apiParam {Number} brightness Brighness [ 0..255 ]
 * @apiParam {Number} x Hue xy color [ 0..1 ]
 * @apiParam {Number} y Hue xy color [ 0..1 ]
 * @apiParam {Number} ct Hue ct color [153..500 ]
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTPS/1.1 200 OK
 *   {
 *     sucess: 'true'
 *     data: "The light group was turned on."
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTPS/1.1 500 Internal error
 *   {
 *     data: Error message
 *   }
 *
 */
async function lightGroupOnOff(req, res, next) {
  lastFnCall = 'lightGroupOnOff';
  logger.info('Light group on/off API called');
  let paramsOK = false;

  if ((typeof req.body.light_number !== 'undefined' && req.body.light_number !== null) ||
        (typeof req.body.light_status !== 'undefined' && req.body.light_status !== null) ||
        (typeof req.body.brightness !== 'undefined' && req.body.brightness !== null)) {
    paramsOK = true;
  }
  if (paramsOK) {
    switch (req.body.light_status.toLowerCase()) {
      case 'on':
        paramsOK = true;
        break;
      case 'off':
        paramsOK = true;
        break;
      default:
        paramsOK = false;
    }
  }
  if (paramsOK) {
    let {
      brightness, x, y, ct,
    } = req.body;
    if (brightness < 0) { brightness = 0; }
    if (brightness > 255) { brightness = 255; }
    if (typeof x !== 'undefined' && x !== null) {
      if (x < 0) { x = 0; }
      if (x > 1) { x = 1; }
    }
    if (typeof y !== 'undefined' && y !== null) {
      if (y < 0) { y = 0; }
      if (y > 1) { y = 1; }
    }
    if (typeof ct !== 'undefined' && ct !== null) {
      if (ct < 153) { ct = 153; }
      if (ct > 500) { ct = 500; }
    }
    await lightshelper.lightGroupOnOff(res, req.body.light_number, req.body.light_status.toLowerCase(), brightness, x, y, ct);
  } else {
    if (typeof res !== 'undefined' && res !== null) {
      alfredHelper.sendResponse(res, false, 'The parameters light_status, light_number or percentage was either not supplied or invalid.');
    }
    logger.info('lightGroupOnOff: The parameters light_status, light_number or percentage was either not supplied or invalid.');
  }
  next();
}
skill.put('/lightgrouponoff', lightGroupOnOff);

/**
 * @api {get} /lights/listlights Lists all of the lights
 * @apiName listlights
 * @apiGroup Lights
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTPS/1.1 200 OK
 *   {
 *     sucess: 'true'
 *     data: Hue bridge API response
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTPS/1.1 500 Internal error
 *   {
 *     data: Error message
 *   }
 *
 */
async function listLights(req, res, next) {
  lastFnCall = 'listLights';
  logger.info('List Lights API called');
  await lightshelper.listLights(res);
  next();
}
skill.get('/listlights', listLights);

/**
 * @api {get} /lights/listlightgroups Lists all of the light groups
 * @apiName listlightgroups
 * @apiGroup Lights
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTPS/1.1 200 OK
 *   {
 *     sucess: 'true'
 *     data: Hue bridge API response
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTPS/1.1 500 Internal error
 *   {
 *     data: Error message
 *   }
 *
 */
async function listLightGroups(req, res, next) {
  lastFnCall = 'listLightGroups';
  logger.info('List Light Groups API called');
  await lightshelper.listLightGroups(res);
  next();
}
skill.get('/listlightgroups', listLightGroups);

/**
 * @api {get} /lights/alloff Turns off all lights
 * @apiName alloff
 * @apiGroup Lights
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTPS/1.1 200 OK
 *   {
 *     sucess: 'true'
 *     data: Hue bridge API response
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTPS/1.1 500 Internal error
 *   {
 *     data: Error message
 *   }
 *
 */
async function allOff(req, res, next) {
  lastFnCall = 'allOff';
  logger.info('Turn off all Lights API called');
  await lightshelper.allOff(res);
  next();
}
skill.get('/alloff', allOff);

/**
 * @api {get} /lights/scenes List all light scenes
 * @apiName scenes
 * @apiGroup Lights
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTPS/1.1 200 OK
 *   {
 *     sucess: 'true'
 *     data: Hue bridge API response
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTPS/1.1 500 Internal error
 *   {
 *     data: Error message
 *   }
 *
 */
async function scenes(req, res, next) {
  lastFnCall = 'scenes';
  logger.info('Get light scenes API called');
  await lightshelper.scenes(res);
  next();
}
skill.get('/scenes', scenes);

/**
 * @api {get} /lights/sensor List all sensors connected to the HUE bridge
 * @apiName sensor
 * @apiGroup Lights
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTPS/1.1 200 OK
 *   {
 *     sucess: 'true'
 *     data: Hue bridge API response
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTPS/1.1 500 Internal error
 *   {
 *     data: Error message
 *   }
 *
 */
async function sensor(req, res, next) {
  lastFnCall = 'sensor';
  await lightshelper.sensor(res);
  next();
}
skill.get('/sensor', sensor);

/**
 * @api {get} /lights/lightstate Get the state of a light
 * @apiName lightstate
 * @apiGroup Lights
 *
 * @apiParam {Number} light_number Hue bridge light number
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTPS/1.1 200 OK
 *   {
 *     sucess: 'true'
 *     data: Hue bridge API response
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTPS/1.1 500 Internal error
 *   {
 *     data: Error message
 *   }
 *
 */
async function lightstate(req, res, next) {
  lastFnCall = 'lightstate';
  if (typeof req.query.light_number !== 'undefined' && req.query.light_number !== null) {
    lightshelper.lightstate(res, req.query.light_number);
  } else {
    if (typeof res !== 'undefined' && res !== null) {
      await alfredHelper.sendResponse(res, false, 'The parameter light_number was not supplied.');
    }
    logger.error('lightstate: The parameter light_number was not supplied.');
  }
  next();
}
skill.get('/lightstate', lightstate);

module.exports = skill;

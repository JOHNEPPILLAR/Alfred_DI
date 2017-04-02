//=========================================================
// Setup TV skill
//=========================================================
const Skills  = require('restify-router').Router;  
      skill   = new Skills(),
      harmony = require('harmonyhubjs-client');

//=========================================================
// Skill: watch fire tv
//=========================================================
function watchFireTv (req, res, next) {

    logger.info ('Watch Fire TV API called');

    harmony(process.env.harmonyip)
    .then(function(harmonyClient) {
        harmonyClient.startActivity(25026204); // Fire TV ID
        harmonyClient.end();
        alfredHelper.sendResponse(res, 'sucess', 'Turned on Fire TV');
    })
    .catch(function (err) {
        // Send response back to caller
        alfredHelper.sendResponse(res, 'error', err.message);
        logger.error('watchFireTv: ' + err);
    });
    next();
};

//=========================================================
// Skill: watch virgin tv
//=========================================================
function watchVirginTv (req, res, next) {

    logger.info ('Watch Virgin TV API called');

    harmony(process.env.harmonyip)
    .then(function(harmonyClient) {
        harmonyClient.startActivity(22797599); // Virgin TV ID
        harmonyClient.end()
        alfredHelper.sendResponse(res, 'sucess', 'Turned on Virgin TV');
    })
    .catch(function (err) {
        // Send response back to caller
        alfredHelper.sendResponse(res, 'error', err.message);
        logger.error('watchVirginTv: ' + err);
    });
    next();
};

//=========================================================
// Skill: play PS4
//=========================================================
function playps4 (req, res, next) {

    logger.info ('Play PS4 API called');

    harmony(process.env.harmonyip)
    .then(function(harmonyClient) {
        harmonyClient.startActivity(23898791); // PS4 ID
        harmonyClient.end()
        alfredHelper.sendResponse(res, 'sucess', 'Turned on play station');
    })
    .catch(function (err) {
        // Send response back to caller
        alfredHelper.sendResponse(res, 'error', err.message);
        logger.error('PlayPS4: ' + err);
    });
    next();
};

//=========================================================
// Skill: turn everythig off
//=========================================================
function turnofftv (req, res, next) {

    logger.info ('Turn off TV API called');

    harmony(process.env.harmonyip)
    .then(function(harmonyClient) {
        harmonyClient.startActivity(-1); // Turn off TV ID
        harmonyClient.end()
        alfredHelper.sendResponse(res, 'sucess', 'Turned off TV');
    })
    .catch(function (err) {
        // Send response back to caller
        alfredHelper.sendResponse(res, 'error', err.message);
        logger.error('Turn off tv: ' + err);
    });
    next();
};

//=========================================================
// Add skills to server
//=========================================================
skill.get('/watchfiretv', watchFireTv);
skill.get('/watchvirgintv', watchVirginTv);
skill.get('/playps4', playps4);
skill.get('/turnoff', turnofftv);

module.exports = skill;
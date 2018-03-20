'use strict'

//CONNECTS TO MONGO DB
let mongooseConnect = require('mongoose');
mongooseConnect.Promise = global.Promise;
mongooseConnect.connect('mongodb://amandamoore3:<password>@ds115124.mlab.com:15124/cattletracks');

module.exports = { mongooseConnect };
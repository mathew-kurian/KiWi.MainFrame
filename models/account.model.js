var mongoose = require('mongoose');
var config = require('./../config');
var Mongol = require('./../libs/mongol.js');
var Schema = Mongol.Extend.Timestamp(mongoose.Schema);

var AccountSchema = Schema(require('./account.model.raw'));

Mongol.path.final(AccountSchema, ['channel']);
Mongol.statics.list(AccountSchema);
Mongol.statics.create(AccountSchema, ['channel']);

module.exports = mongoose.model('Account', AccountSchema);
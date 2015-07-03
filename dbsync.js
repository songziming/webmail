/**
 * Created by Ã÷Ñô on 2015/6/29.
 */
var config, db;

config = require('./config');

db = require('./database')(config.database.name, config.database.username, config.database.password, config.database.config).sync({
    force: true
}).then (function(db) {
    require('./init')(db)
}).then(function() {
    console.log('Sync successfully!');
})["catch"](function(err) {
    return console.log(err.message);
});

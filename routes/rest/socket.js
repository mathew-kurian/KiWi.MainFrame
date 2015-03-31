var sockets = require("./../../sockets");
var event = require("./../../constants/event");

module.exports = {
    open: function (req, res) {
        var secret = sockets.Account.open(req.token._id, req.token.account);
        res.sendOk({secret: secret});
    },
    close: function (req, res) {
        var count = sockets.Account.close(req.token._id, req.token.account);
        res.sendOk({closed: count});
    },
    debug : {
        dashboard: function(req, res){
            res.render('rest-socket-dashboard', { token: req.token._id, client_id: req.query.client_id });
        },
        emit: function(req, res){
            sockets.Account.emit(req.token.account, event.debug, { content: req.query.content });
            res.sendOk({info: "emitted on account id:" + req.token.account});
        }
    }
};



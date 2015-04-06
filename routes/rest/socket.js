var sockets = require("./../../sockets");
var event = require("./../../constants/event");

module.exports = {
    open: function (req, res) {
        var secret;
        switch (req.query.action) {
            case "account" :
            {
                secret = sockets.Account.open(req.token._id, req.token.account);
                res.sendOk({secret: secret});
                break;
            }
            case "lock" :
            {
                secret = sockets.Lock.open(req.query.serial);
                res.sendOk({secret: secret});
                break;
            }
            default:
            {
                return res.sendErr(event.disconnected, "No valid action provided");
            }
        }
    },
    close: function (req, res) {
        var count;
        switch (req.query.action) {

            case "account":
            {
                count = sockets.Account.close(req.token._id, req.token.account);
                res.sendOk({closed: count});
                break;
            }
            case "lock":
            {
                count = sockets.Lock.close(req.token._id, req.token.account);
                res.sendOk({closed: count});
                break;
            }
        }
    },
    debug: {
        dashboard: function (req, res) {
            res.render('rest-socket-dashboard', {token: req.token._id, client_id: req.query.client_id});
        },
        emit: function (req, res) {
            sockets.Account.emit(req.token.account, event.debug, {content: req.query.content});
            res.sendOk({info: "emitted on account id:" + req.token.account});
        }
    }
};



var account = require('./account.js');

module.exports.install = function (io) {
    io.use(function (socket, next) {
        socket.secret = socket.request._query['secret'];
        socket.action = socket.request._query['action'];

        // FIXME stop handling request if secret OR action == null

        next();
    });

    io.on('connection', function (socket) {
        // FIXME @kgowru - Add print statement here
        switch (socket.action) {
            case 'account':
                account.connected(socket);
        }
    });


    io.on('disconnect', function (socket) {
        // FIXME @kgowru - Add print statement here
        switch (socket.action) {
            case 'account':
                account.disconnected(socket);
        }
    });
};

module.exports.Account = require("./account.js");






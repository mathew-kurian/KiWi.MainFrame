var socket;

module.exports.install = function (tcp) {
    socket = tcp;
};

module.exports.broadcast = function (channels, event, data) {
    if (!socket) return console.error("Dropped broadcast: ", channels, data);
    if (!Array.isArray(channels)) channels = [channels];

    for (var i = 0; i < channels.length; i++)
        socket.emit(channels[i], {event: event, res: data});
};



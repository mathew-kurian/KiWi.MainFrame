var Reflux = require('reflux');
var AppActions = require('./../actions/app-actions');
var $ = require('jquery');

var EventStore = Reflux.createStore({
    events: {},
    listenables: [AppActions],

    onLogin: function (token) {
        EventStore.token = token;
    },
    addEvent: function (e) {
        e = e.data;
        console.log("--start---");
        console.log(e);
        console.log("--end---");
        if(!EventStore.events[e.lock]) EventStore.events[e.lock] = [];
        EventStore.events[e.lock].push(e);
        EventStore.trigger(EventStore.events);
    },
    getEvents: function (lock) {
        if (!EventStore.events[lock]) {
            $.get("/rest/lock/events?client_id=dev", {lock: lock, token: EventStore.token}, function (res) {
                console.log(res.data.events);
                EventStore.events[lock] = res.data.events;
                EventStore.trigger(EventStore.events);
            });
        }

        return EventStore.events[lock] || [];
    }
});

module.exports = EventStore;
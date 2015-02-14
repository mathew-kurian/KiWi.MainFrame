var ShortId = require('shortid');
var Chance = require('chance')();
var randomWords = require('random-words');

var User = function () {
    var u = {
        _id: ShortId.generate(),
        name: {
            first: Chance.first(),
            last: Chance.last()
        },
        mobile: Chance.phone().replace(/[\(\s\(]/g, ""),
        photo: "https://randomuser.me/api/portraits/med/" + (Math.random() > 0.5 ? "men" : "women") + "/" + parseInt(Math.random() * 90) + ".jpg",
        created: new Date(Date.now() - Math.random() * 50000)
    };

    u.username = (u.name.first.substring(0, 1) + u.name.last).toLowerCase();

    return u;
};

var users = [];

for (var i = 10; i < (20 + parseInt(Math.random() * 50)); i++) {
    users.push(User());
}

User.list = users;

var Lock = function () {

    var _id = ShortId.generate();
    var owner = User.list[parseInt(Math.random() * User.list.length)]._id;
    var pairedUsers = [];

    for (var i = 0; i < Math.min(parseInt(Math.random() * User.list.length), 10); i++) {
        if (User.list[i]._id == owner) continue;
        pairedUsers.push(User.list[i]._id);
    }

    pairedUsers.push(owner);

    var events = [];

    for (i = 0; i < Math.random() * 30; i++) {
        events.push(Event(_id, pairedUsers));
    }

    return {
        owner: owner,
        _id: _id,
        _sid: ShortId.generate(),
        name: randomWords(),
        location: {lat: Chance.latitude(), long: Chance.longitude()},
        pairedUsers: pairedUsers,
        pairedTime: new Date(Date.now() - -10000 - 50000 * Math.random()),
        battery: parseInt(Math.random() * 101),
        created: new Date(Date.now() - 50000 * Math.random()),
        events: events,
        alert : false,
        powerState : Chance.integer({min: 0, max: 2})
    }
};

var Event = function (lock, pairedUsers) {
    var texts = ["system maintenance started", "system maintenance completed", "system error",
        "shared a lock", "opened a lock", "locked door", "auto locking door due to inactivity", "low battery detected"];
    var randIndex = parseInt(Math.random() * texts.length);
    return {
        _id: ShortId.generate(),
        lock: lock,
        user: (function () {
            return randIndex < 3 ? "system" : pairedUsers[parseInt(pairedUsers.length * Math.random())];
        })(),
        text: texts[randIndex],
        created: new Date(Date.now() - (Math.random() * 5000))
    }
};

var locks = [];

for (i = 10; i < (10 + parseInt(Math.random() * 15)); i++) {
    locks.push(Lock());
}

Lock.list = locks;

module.exports = {
    TestDB: {
        getUsers: function () {
            return User.list;
        },
        getLocks: function () {
            return Lock.list;
        }
    }
};
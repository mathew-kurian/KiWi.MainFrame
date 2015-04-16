var Reflux = require('reflux');
var AppActions = require('./../actions/app-actions');
var LockStore = require('./lock-store')
var $ = require('jquery');
var event = require('./../../constants/event')

var AccountStore = Reflux.createStore({
    accounts: {},
    token: undefined,
    listenables: [AppActions],

    _onLogin: 0,
    onLogin: function (token) {
        if (AccountStore._onLogin++) return;
        AccountStore.token = token;
        $.get('/rest/account/info?client_id=dev&token=' + AccountStore.token, function (res) {
            if (res.status || !res.data) {
                AccountStore._onLogin = 0;
                return notify(res.msg);
            }

            AccountStore.accounts[res.data.account._id] = res.data.account;

            AccountStore._onLogin = 0;
            AccountStore.trigger(AccountStore.accounts);
        });

        $.get('/rest/socket/open?client_id=dev&action=account&token=' + AccountStore.token, function (res) {
            var socket = new WebSocket('ws://' + window.location.host + '/socket?secret=' + res.data.secret + '&action=account');
            socket.onmessage = function (msg) {
                var data = JSON.parse(msg.data);
                switch(data.event){
                    case event.new_event: return notify(JSON.stringify(event));
                    case event.lock_manual:
                    case event.lock_lock_command_fail:
                    case event.lock_lock_command_success:
                    case event.lock_unlock_command_fail:
                    case event.lock_unlock_command_success:
                    case event.lock_registered:
                    case event.lock_unregistered: LockStore.forceUpdate(data.data.lock);
                        break;
                        case event.bounce:
                            LockStore.bounce(data.data.lock._id);
                }
            }
        });
    },
    getAccount: function (account) {
        if (AccountStore.accounts[account]) return AccountStore.accounts[account];

        $.get('/rest/account/info?client_id=dev&token=' + AccountStore.token + "&account=" + account, function (res) {
            if (res.status || !res.data) {
                return notify(res.msg);
            }

            AccountStore.accounts[res.data.account._id] = res.data.account;
            AccountStore.trigger(AccountStore.accounts);
        });
    }
});

module.exports = AccountStore;
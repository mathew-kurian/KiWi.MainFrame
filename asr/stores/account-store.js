var Reflux = require('reflux');
var AppActions = require('./../actions/app-actions');
var $ = require('jquery');

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
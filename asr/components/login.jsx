/**
 * @jsx React.DOM
 */


var $ = require('jquery');
var React = require('react');
var UIUtils = require('./../utils/ui-utils');
var Dashboard = require('./dashboard.jsx');
var Account = require('./../../models/account.model.raw');
var ls = global.localStorage;

var Login = React.createClass({
    getInitialState: function () {
        return {
            // FIXME make client_id a constant - not in config.js
            client_id: "dev",
            username: "",
            password: "",
            name: {first: "", last: ""},
            email: "",
            mobile: "",
            wait: false,
            login_visible: true,
            token: undefined
        }
    },
    componentDidMount: function () {
        this.setState({token: ls ? ls.getItem('token') : undefined});
    },
    handleLogin: function () {
        if (this.state.wait) return;

        var self = this;

        self.setState({wait: true});

        $.ajax({
            url: 'http://kiwi.t.proxylocal.com/rest/account/login?' +
            'client_id=' + this.state.client_id +
            '&username=' + this.state.username +
            '&password=' + this.state.password,
            dataType: 'json',
            type: 'GET',
            success: function (res) {
                if (res.status) {
                    self.setState({wait: false});
                    return notify(res.err);
                }

                ls.setItem('token', res.data.token);
                self.setState({token: res.data.token});

            }.bind(this),
            error: function (xhr, status, err) {
                notify(status, err);
                self.setState({wait: false});
            }.bind(this)
        });
    },

    handleCreate: function () {
        if (this.state.wait) return;

        var self = this;

        self.setState({wait: true});

        $.ajax({
            url: 'http://kiwi.t.proxylocal.com/rest/account/create?' + '' +
            'client_id=' + this.state.client_id +
            '&name[first]=' + this.state.name.first +
            '&name[last]=' + this.state.name.last +
            '&username=' + this.state.username +
            '&password=' + this.state.password +
            '&email=' + this.state.email +
            '&mobile=' + this.state.mobile,
            dataType: 'json',
            type: 'GET',
            success: function (res) {
                if (res.status) {
                    self.setState({wait: false});
                    return notify(res.err);
                }

                notify("Created account! Please proceed to login.");

            }.bind(this),
            error: function (xhr, status, err) {
                notify(status, err);
                self.setState({wait: false});
            }.bind(this)
        });
    },
    toggleLogin: function () {
        this.setState({login_visible: !this.state.login_visible});
    },
    render: function () {
        return this.state.token ? ( <Dashboard token={this.state.token} client_id={this.state.client_id} />) :

            (
                <div className="account">
                    <div className="scroll">
                        <div className={"login " + (this.state.login_visible || "hidden")}>
                            <div className="floater">
                                <div className="title">Login</div>
                                <div className="description">Use a KiWi account to view the dashboard and control your locks from a remote location. You can also add new devices, share keys, and enable GeoFencing.</div>
                                <input onChange={UIUtils.validate(this, 'username', {validate: Account.username.validate}) } placeholder="Username" type="username" />
                                <input onChange={UIUtils.validate(this, 'password', {validate: Account.password.validate}) } placeholder="Password" type="password" />
                                <button onClick={ this.handleLogin }>
                                    <div className="label">Login</div>
                                </button>
                                <div className="description center large">Don't have an account&#63; <a onClick={this.toggleLogin} href="#">Sign up</a></div>
                            </div>
                        </div>
                        <div className={"create " + (!this.state.login_visible || "hidden")}>
                            <div className="floater">
                                <div className="title">Sign Up</div>
                                <div className="description">Use a KiWi account to view the dashboard and control your locks from a remote location. You can also add new devices, share keys, and enable GeoFencing.</div>
                                <input onChange={UIUtils.validate(this, 'name.first', {validate: Account.name.first.validate}) } placeholder="First Name" type="email" />
                                <input onChange={UIUtils.validate(this, 'name.last', {validate: Account.name.last.validate}) } placeholder="Last Name" type="text"/>
                                <div className="label">
                                    <span className="icon email"></span>
                                    <input onChange={UIUtils.validate(this, 'email', {validate: Account.email.validate}) } placeholder="Email" type="email" />
                                </div>
                                <div className="label">
                                    <span className="icon phone"></span>
                                    <input onChange={UIUtils.validate(this, 'mobile', {validate: Account.mobile.validate}) } placeholder="Mobile" type="phone" />
                                </div>
                                <input onChange={UIUtils.validate(this, 'username', {validate: Account.username.validate}) } placeholder="Username" type="username" />
                                <input onChange={UIUtils.validate(this, 'password', {validate: Account.password.validate}) } placeholder="Password" type="password" />
                                <div className="description small">By clicking on Sign up, you agree to KiWi's <a href="#">terms &amp; conditions</a> and <a href="#">privacy policy</a></div>
                                <button onClick={ this.handleCreate }>
                                    <div className="label">Create</div>
                                </button>
                                <div className="description center large">Already have an account&#63; <a onClick={this.toggleLogin} href="#">Log in</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
});

module.exports = Login;

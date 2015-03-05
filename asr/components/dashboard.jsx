/**
 * @jsx React.DOM
 */

var React = require('react');
var LockItem = require('./lock-item.jsx');
var LockBanner = require('./lock-banner.jsx');
var LockEventFlow = require('./widgets/lock-event-flow.jsx');
var LockUserFlow = require('./widgets/lock-user-flow.jsx');
var LockLiteControls = require('./widgets/lock-lite-controls.jsx');
var LockBatteryLevel = require('./widgets/lock-battery-level.jsx');
var LockSignalStrength = require('./widgets/lock-signal-strength.jsx');
var UIUtils = require('./../utils/ui-utils');
var TestDB = require('./../utils/test-utils').TestDB;

var tid = 0;

var Dashboard = React.createClass({

    getInitialState: function () {
        return {
            title: "dashboard",
            logo: "hello",
            message: "hello",
            flowClass: "lock-event-flow",
            users: [],
            locks: [],
            activeLock: undefined
        };
    },

    onLockNotify: function () {

        var self = this;
        var activeLock = self.state.activeLock;
        activeLock.alert = true;
        self.setState({activeLock: activeLock});

        setTimeout(function () {
            activeLock = self.state.activeLock;
            activeLock.alert = false;
            self.setState({activeLock: activeLock});
        }, 500);
    },

    componentDidMount: function () {
        var self = this;
        var locks = TestDB.getLocks();
        var users = TestDB.getUsers();

        this.setState({locks: locks});
        this.setState({users: users});
        this.setState({activeLock: locks[parseInt(locks.length * Math.random())]});

        var generateNotifications = function () {
            self.onLockNotify();
            tid = setTimeout(generateNotifications, Math.random() * 3000);
        };

        generateNotifications();
    },

    componentWillUnmount: function () {
        clearTimeout(tid);
    },

    onLockFocus: function (id) {
        for (var i = 0; i < this.state.locks.length; i++) {
            if (this.state.locks[i]._id == id) {
                // turn off last activeLock
                var activeLock = this.state.activeLock;
                activeLock.alert = false;
                this.setState({activeLock: activeLock});
                // turn on new activeLock
                return this.setState({activeLock: this.state.locks[i]});
            }
        }
    },

    render: function () {
        var self = this;

        var lockItemObjects = this.state.locks.map(function (lock) {
            return (
                <LockItem key={lock._id} lock={lock} onLockFocus={self.onLockFocus} active={ self.state.activeLock && lock._id === self.state.activeLock._id }/>
            );
        });

        var renderFlow = function () {
            if (self.state.activeLock) {
                switch (self.state.flowClass) {
                    default:
                        return null;
                    case "lock-event-flow" :
                        return <LockEventFlow users={ self.state.users || [] } events={ self.state.activeLock.events }/>;
                    case "lock-user-flow" :
                        return <LockUserFlow users={ self.state.users || [] } />;
                }
            }
            return null;
        };

        var showEventFlow = function () {
            self.state.flowClass = "lock-event-flow";
            self.forceUpdate();
        };
        var showUserFlow = function () {
            self.state.flowClass = "lock-user-flow";
            self.forceUpdate();
        };
        var showSettingsFlow = function () {
            self.state.flowClass = "lock-settings-flow";
            self.forceUpdate();
        };
        var showMenuFlow = function () {
            self.state.flowClass = "lock-menu-flow";
            self.forceUpdate();
        };

        return (
            <div className = "main">
                <section className="left">
                    <div className="header">
                        <div className="title">{ this.state.title }</div>
                        <div className="logo"></div>
                        <div className="message">{ this.state.message }</div>
                    </div>
                    <div>
                        <div className="section-title">Active</div>
                        <div className="locks">{ lockItemObjects }</div>
                        <div className="section-title">Options</div>
                        <div className="section-title">Inactive</div>
                    </div>
                </section>
                <section className="right">
                    <div className="sidebar">
                        <div className="monitor">
                            <div className={ UIUtils.calcLightClasses(this.state.activeLock) }></div>
                        </div>
                        <div>
                            <div onClick={ showEventFlow } className={ UIUtils.checkJoin("icon dashboard", this.state.flowClass, "lock-event-flow", " active") }></div>
                            <div onClick={ showUserFlow } className={ UIUtils.checkJoin("icon users", this.state.flowClass, "lock-user-flow", " active") }></div>
                            <div onClick={ showSettingsFlow } className={ UIUtils.checkJoin("icon settings", this.state.flowClass, "lock-settings-flow", " active") }></div>
                            <div onClick={ showMenuFlow } className={ UIUtils.checkJoin("icon menu bottom", this.state.flowClass, "lock-menu-flow", " active") }></div>
                        </div>
                    </div>
                    { this.state.activeLock ? <LockBanner lock={ this.state.activeLock }/> : null }
                    <div className="content">
                        <div className="inset flex">
                            <div className="content-left box">
                                <div className="flex vertical">{ renderFlow() }</div>
                                <div className="filler"></div>
                            </div>
                            <div className="content-right box">
                                <div className="flex vertical">
                                    <div className = "flex">
                                        <LockLiteControls />
                                    </div>
                                    <div className = "flex">
                                        <LockBatteryLevel />
                                        <LockSignalStrength />
                                    </div>
                                </div>
                                <div className="filler"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
});

module.exports = Dashboard;

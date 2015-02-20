/**
 * @jsx React.DOM
 */

var React = require('react');
var LockItem = require('./lock-item.jsx');
var LockBanner = require('./lock-banner.jsx');
var LockEventFlow = require('./widgets/lock-event-flow.jsx');
var LockControlsOverview = require('./lock-controls-overview.jsx');
var LockUsersOverview = require('./lock-users-overview.jsx');
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

        var lockObjects = this.state.locks.map(function (lock) {
            return (
                <LockItem key={lock._id} lock={lock} onLockFocus={self.onLockFocus} active={ self.state.activeLock && lock._id === self.state.activeLock._id }/>
            );
        });

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
                        <div className="locks">{ lockObjects }</div>
                        <div className="section-title">Options</div>
                        <div className="section-title">Inactive</div>
                    </div>
                </section>
                <section className="right">
                    <div className="inner-content flex vertical">
                    { this.state.activeLock && this.state.flowClass === "lock-event-flow" ?
                        <LockEventFlow users={ this.state.users || [] } events={ this.state.activeLock.events }/> : null }
                    </div>
                    <div className="inner-sidebar">
                        <div className="monitor">
                            <div className={ UIUtils.calcLightClasses(!!this.state.activeLock, this.state.activeLock) }></div>
                        </div>
                        <div>
                            <div className="home"></div>
                            <div className="users"></div>
                            <div className="settings"></div>
                            <div className="emergency"></div>
                        </div>
                    </div>
                    { this.state.activeLock ? <LockBanner lock={ this.state.activeLock }/> : null }
                    <LockControlsOverview />
                    <LockUsersOverview />
                </section>
            </div>
        )
    }
});

module.exports = Dashboard;

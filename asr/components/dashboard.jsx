/**
 * @jsx React.DOM
 */

var React = require('react');
var LockItem = require('./lock-item.jsx');
var LockBanner = require('./lock-banner.jsx');
var LockEventFlow = require('./lock-event-flow.jsx');
var LockControlsOverview = require('./lock-controls-overview.jsx');
var LockUsersOverview = require('./lock-users-overview.jsx');

var Dashboard = React.createClass({

    getInitialState: function () {
        return {
            title: "KiWi",
            logo: "hello",
            message: "hello",
            flowClass: "lock-event-flow",
            activeLockId: undefined,
            locks: [
                {name: "Home", _id: "10", powerState: 0, lastUpdated: "a few seconds ago", battery: "95"},
                {name: "Vacation", _id: "11", powerState: 1, lastUpdated: "a few seconds ago", battery: "50"}
            ]
        }
    },

    onLockFocus: function (id) {
        console.log("Detected click");
        this.setState({activeLockId: id});
    },

    onLockAdd: function (id) {
        this.setState({activeLockId: null});
    },

    onLockRemove: function (id) {
        this.setState({activeLockId: null});
    },

    render: function () {
        var self = this;

        var lockObjects = this.state.locks.map(function (lock) {
            return (
                <LockItem key={lock._id} lock={lock} onLockFocus={self.onLockFocus} active={ lock._id === self.state.activeLockId }/>
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
                    <div className="inner-sidebar">
                        <div className="monitor">
                            <div className="light"></div>
                        </div>
                        <div>
                            <div className="home"></div>
                            <div className="users"></div>
                            <div className="settings"></div>
                            <div className="emergency"></div>
                        </div>
                    </div>
                    <LockBanner lock={ this.state.locks[0] }/>
                    { this.state.flowClass === "lock-event-flow" ?
                        <LockEventFlow lock={ this.state.locks[0] }/> : null }
                    <LockControlsOverview />
                    <LockUsersOverview />
                </section>
            </div>
        )
    }
});

module.exports = Dashboard;

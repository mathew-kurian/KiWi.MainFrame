/**
 * @jsx React.DOM
 */

var React = require('react');
var LockItem = require('./lock-item.jsx');
var LockBanner = require('./lock-banner.jsx');
var LockEventFlow = require('./lock-event-flow.jsx');
var LockControlsOverview = require('./lock-controls-overview.jsx');
var LockUsersOverview = require('./lock-users-overview.jsx');

var intervalId = 0;

var Dashboard = React.createClass({

    getInitialState: function () {
        var state = {
            title: "KiWi",
            logo: "hello",
            message: "hello",
            flowClass: "lock-event-flow",
            locks: [
                {name: "Home", _id: "10", powerState: 0, lastUpdated: "a few seconds ago", battery: "95"},
                {name: "Vacation", _id: "11", powerState: 1, lastUpdated: "a few seconds ago", battery: "50"}
            ]
        };

        state.activeLock = state.locks[0];

        return state;
    },

    componentDidMount: function () {
        var blink = function () {
            var lightFocus = document.getElementsByClassName("light")[0];
            var lightItem = document.getElementsByClassName("power")[0];

            if (lightFocus.getAttribute('class').indexOf('on') > -1) {
                lightFocus.setAttribute('class', 'light');
                lightItem.setAttribute('class', 'power blue');
            } else {
                lightFocus.setAttribute('class', 'light on');
                lightItem.setAttribute('class', 'power blue on');
            }

            intervalId = setTimeout(blink, Math.random() * 2000);
        };

        blink();
    },

    componentWillUnmount: function () {
        clearInterval(intervalId);
    },

    onLockFocus: function (id) {
        for (var i = 0; i < this.state.locks.length; i++) {
            if (this.state.locks[i]._id == id) {
                return this.setState({activeLock: this.state.locks[i]});
            }
        }
    },

    render: function () {
        var self = this;

        var lockObjects = this.state.locks.map(function (lock) {
            return (
                <LockItem key={lock._id} lock={lock} onLockFocus={self.onLockFocus} active={ lock._id === self.state.activeLock._id }/>
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
                    <LockBanner lock={ this.state.activeLock }/>
                    { this.state.flowClass === "lock-event-flow" ?
                        <LockEventFlow lock={ this.state.activeLock }/> : null }
                    <LockControlsOverview />
                    <LockUsersOverview />
                </section>
            </div>
        )
    }
});

module.exports = Dashboard;

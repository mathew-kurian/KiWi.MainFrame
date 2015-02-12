/**
 * @jsx React.DOM
 */

var React = require('react');
var Lock = require('./lock.jsx');

var Dashboard = React.createClass({

    getInitialState: function () {
        return {
            title: "KiWi Control",
            logo: "hello",
            message : "hello",
            activeLockId : undefined,
            locks : [
                {name: "Pete Hunt", _id: "10"},
                {name: "Jordan Walke", _id: "11"}
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
                <Lock key={lock._id} lock={lock} onLockFocus={self.onLockFocus} active={ lock._id === self.state.activeLockId }/>
            );
        });

        return (
            <div className = "main">
                <section className="left">
                    <div className="title">{ this.state.title }</div>
                    <div className="logo"></div>
                    <div className="message">{ this.state.message }</div>
                    <div className="locks">{ lockObjects }</div>
                </section>
                <section className="right"></section>
            </div>
        )
    }
});

module.exports = Dashboard;

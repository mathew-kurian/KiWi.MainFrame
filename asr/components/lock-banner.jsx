/**
 * @jsx React.DOM
 */

var React = require('react');

var LockBanner = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {
        return (
            <div className="banner">
                <div className="name">{ this.props.lock.name }</div>
                <div className="last-updated">checked in <b>{ this.props.lock.lastUpdated }</b></div>
                <div className="wifi-signal-strength">{ this.props.lock.wifiSignalStrength }</div>
                <div className="battery">{ this.props.lock.battery }</div>
            </div>
        )
    }
});

module.exports = LockBanner;

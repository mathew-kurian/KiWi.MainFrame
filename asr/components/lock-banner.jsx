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
                <div className="name"><span className="pre">Lock</span> <span className="cen">{ this.props.lock.name }</span></div>
                <div className="last-updated">checked in { this.props.lock.lastUpdated || "a few hours ago" }</div>
                <div className="wifi-signal-strength">{ this.props.lock.wifiSignalStrength }</div>
            </div>
        )
    }
});

module.exports = LockBanner;

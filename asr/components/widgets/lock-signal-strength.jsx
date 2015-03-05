/**
 * @jsx React.DOM
 */

var React = require('react');

var LockSignalStrength = React.createClass({

    getInitialState: function () {
        return null;
    },

    render: function () {
        return (
            <div className="section blue box">
                <div className="title">WiFi</div>
                <div className="signal icon wifi"></div>
            </div>
        )
    }
});

module.exports = LockSignalStrength;

/**
 * @jsx React.DOM
 */

var React = require('react');

var LockBatteryLevel = React.createClass({

    getInitialState: function () {
        return null;
    },

    render: function () {
        return (
            <div className="section teal box">
                <div className="title">Battery</div>
                <div className="battery">96</div>
            </div>
        )
    }
});

module.exports = LockBatteryLevel;

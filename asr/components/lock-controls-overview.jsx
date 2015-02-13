/**
 * @jsx React.DOM
 */

var React = require('react');

var LockControlsOverview = React.createClass({

    getInitialState: function () {
        return {
            active: false,
            name : "Undefined",
            power : false
        }
    },

    render: function () {
        return (
            <div className="extra-content secondary">
                <div className="title">Manage</div>
                <div className="toggle-lock"></div>
                <div>
                    <div className="toggle-power"></div>
                    <div className="toggle-power-label">Power</div>
                </div>
            </div>
        )
    }
});

module.exports = LockControlsOverview;

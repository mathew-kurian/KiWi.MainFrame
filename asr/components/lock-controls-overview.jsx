/**
 * @jsx React.DOM
 */

var React = require('react');

var LockControlsOverview = React.createClass({

    getInitialState: function () {
        return {
            active: false,
            name: "Undefined",
            power: false
        }
    },

    render: function () {
        return (
            <div className="primary-right flex vertical">
                <div className = "flex">
                    <div className="section box">
                        <div className="title">Manage</div>
                        <div className="button">
                            <div className="label">lock door</div>
                        </div>
                        <div className="block">
                            <div className="toggle-power toggle small inline">
                                <div className="label">on</div>
                                <div className="handle"></div>
                            </div>
                            <div className="title inline">Power</div>
                        </div>
                    </div>
                </div>
                <div className = "flex">
                    <div className="section teal box">
                        <div className="title">Battery</div>
                        <div className="battery">96</div>
                    </div>
                    <div className="section blue box">
                        <div className="title">WiFi</div>
                        <div className="signal icon wifi"></div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = LockControlsOverview;

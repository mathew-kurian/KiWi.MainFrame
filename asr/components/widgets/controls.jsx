/**
 * @jsx React.DOM
 */

var React = require('react');

var Controls = React.createClass({

    getInitialState: function () {
        return {
            active: false,
            name: "Undefined",
            power: false
        }
    },

    render: function () {
        return (
            <div className="section box"
                 style={{"max-width": "300px", "border-right": "1px solid #DDD", "padding-right": "20px"}}>
                <h2>Manage</h2>

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
        )
    }
});

module.exports = Controls;

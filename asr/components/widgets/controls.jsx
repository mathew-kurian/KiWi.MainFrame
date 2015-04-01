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

                <div className="button" style={{marginTop: "25px"}}>
                    <div className="label">lock door</div>
                </div>
                <div className="block">
                    <div className="toggle-power toggle small" style={{display: "inline-block"}}>
                        <div className="label">on</div>
                        <div className="handle"></div>
                    </div>
                    <div
                        style={{display: "inline-block", verticalAlign: "top", fontSize: "13px", margin: "4px", marginLeft: "9px", fontWeight: "600", color: "#5A6678"}}>
                        Power
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Controls;

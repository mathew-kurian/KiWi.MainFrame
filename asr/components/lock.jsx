/**
 * @jsx React.DOM
 */

var React = require('react');

var Lock = React.createClass({

    getInitialState: function () {
        return {
            active: false,
            name : "Undefined",
            power : false
        }
    },

    onLockFocus: function () {
        this.props.onLockFocus(this.props.lock._id);
    },

    render: function () {
        return (
            <div className={ "device " + (this.props.active ? "active" : "")} onClick={this.onLockFocus}>
                <div className="power">{ this.state.power }</div>
                <div className="name">{ this.props.name }</div>
            </div>
        )
    }
});

module.exports = Lock;

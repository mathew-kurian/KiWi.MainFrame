/**
 * @jsx React.DOM
 */

var React = require('react');

var LockItem = React.createClass({

    getInitialState: function () {
        return {
            active: false,
            name : "Undefined"
        }
    },

    onLockFocus: function () {
        this.props.onLockFocus(this.props.lock._id);
    },

    render: function () {
        return (
            <div className={ "device " + (this.props.active ? "active" : "")} onClick={this.onLockFocus}>
                <div className={ this.props.lock.powerState ? "power green" : "power blue" }></div>
                <div className="name">{ this.props.lock.name }</div>
            </div>
        )
    }
});

module.exports = LockItem;

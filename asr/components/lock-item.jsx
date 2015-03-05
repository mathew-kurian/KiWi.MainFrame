/**
 * @jsx React.DOM
 */

var React = require('react');
var UIUtils = require('./../utils/ui-utils');

var LockItem = React.createClass({

    getInitialState: function () {
        return {
            active: false,
            name: "Undefined"
        }
    },

    onLockFocus: function () {
        this.props.onLockFocus(this.props.lock._id);
    },

    render: function () {
        return (
            <div className={ "device " + (this.props.active ? "active" : "")} onClick={this.onLockFocus}>
                <div className={ UIUtils.calcLightClasses(this.props.lock) }></div>
                <div className="name">{ this.props.lock.name }</div>
            </div>
        )
    }
});

module.exports = LockItem;

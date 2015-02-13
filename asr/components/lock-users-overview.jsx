/**
 * @jsx React.DOM
 */

var React = require('react');

var LockUsersOverview = React.createClass({

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
                <div className="title">{ this.state.title }</div>
                <div className="name"></div>
            </div>
        )
    }
});

module.exports = LockUsersOverview;

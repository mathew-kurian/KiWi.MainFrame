/**
 * @jsx React.DOM
 */

var React = require('react');
var moment = require('moment');

// inner class
var UserItem = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {

        return (
            <div></div>
        )
    }
});

var LockUserFlow = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {
        var self = this;

        return (
            <div className="lock-user-flow flow flex">
                <div className="section box">
                    <div className="title no-margin">Users Flow</div>
                    <div className="block event-flow">{  }</div>
                </div>
            </div>
        )
    }
});

module.exports = LockUserFlow;

/**
 * @jsx React.DOM
 */

var React = require('react');
var ShortId = require('shortid');

var NotificationItem = React.createClass({
    render: function () {
        return (
            <div className="event">
                <div className="status">{ this.props.event.status }</div>
                <div className="msg">{ this.props.event.msg }</div>
            </div>
        )
    }
});

var NotificationCenter = React.createClass({

    getInitialState: function () {
        return {}
    },
    componentDidMount: function () {
        var self = this;
        window.notify = function () {
            self.addItem.apply(self, arguments);
        };
    },
    removeItem: function (id) {
        var event = {};
        event[id] = undefined;
        this.setState(event);
    },

    addItem: function (msg, status, _id) {
        var self = this;
        var event = {};
        var id = _id || ShortId.generate();

        console.log(arguments);

        event[id] = {
            status: status,
            msg: msg,
            id: id
        };

        this.setState(event);

        // FIXME make timeout a constant - not in config.js
        setTimeout(function () {
            self.removeItem(id);
        }, 5000);
    },

    render: function () {
        var NotificationItemObjects = [];

        for (var e in this.state) {
            if (!this.state.hasOwnProperty(e)) continue;
            var event = this.state[e];
            if (!event) continue;
            NotificationItemObjects.push(
                <NotificationItem event={event} removeHandle={this.removeItem}/>
            );
        }

        return (
            <div className="notification-center">{ NotificationItemObjects }</div>
        )
    }
});

module.exports = NotificationCenter;

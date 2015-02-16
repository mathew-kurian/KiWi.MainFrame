/**
 * @jsx React.DOM
 */

var React = require('react');
var moment = require('moment');

// inner class
var EventItem = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {
        return (
            <div className="event">
                <div className="icon"></div>
                <div className="image"></div>
                <div className="info">
                    <div className="data-left">
                        <div className="data-top">
                            <div className={ "user " + ["blue", "green", "yellow", "red", "teal"][parseInt(Math.random() * 5)]} >{ this.props.event.user ? "task" : "system" }</div>
                        </div>
                        <div className="data-bottom">mobile</div>
                    </div>
                    <div className="data-right">
                        <div className="data-top">
                            <span className="text">{ this.props.event.text.substring(0, 1).toUpperCase() + this.props.event.text.substring(1) }</span>
                        </div>
                        <div className="data-bottom">{ this.props.event.user ? this.props.event.user + ' · ' : '' } { moment(this.props.event.created).fromNow() }</div>
                    </div>
                </div>
            </div>
        )
    }
});

var LockEventFlow = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {

        var eventObjects = this.props.events.map(function (event) {
            return (
                <EventItem key={event._id} event={event}/>
            );
        });

        return (
            <div className="flex">
                <div className="section box">
                    <div className="title">Event Flow</div>
                    <div className="block event-flow">{ eventObjects }</div>
                </div>
            </div>
        )
    }
});

module.exports = LockEventFlow;

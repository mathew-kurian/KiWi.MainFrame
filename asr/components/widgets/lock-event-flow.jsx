/**
 * @jsx React.DOM
 */

var React = require('react');
var moment = require('moment');

var eventTypeColorMap = {
    system: "blue",
    lock: "green",
    unlock: "yellow",
    battery: "red",
    share: "teal",
    geofence: "teal",
    unshare: "yellow"
}

// inner class
var EventItem = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {

        return (
            <div className="event">
                <div className={ "icon " + this.props.event.type }></div>
                <div className="image"></div>
                <div className="info">
                    <div className="data-right">
                        <div className="data-top">
                            <span className={ "user " + eventTypeColorMap[this.props.event.type]} >{ this.props.event.type }</span>
                            <span className="text">{ this.props.event.text.substring(0, 1).toUpperCase() + this.props.event.text.substring(1) }</span>
                        </div>
                        <div className="data-bottom">
                            <span className="user">{ this.props.user ? this.props.user.username : "system" }</span> &middot; { moment(this.props.event.created).fromNow() }
                        </div>
                    </div>
                </div>
                <div className="button tiny">
                    <div className="label">Restore</div>
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

        var self = this;

        var findUsernameById = function(id){
            for(var i = 0; i < self.props.users.length; i++){
                var user = self.props.users[i];
                if(user._id == id){
                    return user;
                }
            }
        };

        var eventObjects = this.props.events.map(function (event) {
            return (
                <EventItem key={event._id} event={event} user={ findUsernameById(event.user) }/>
            );
        });

        return (
            <div className="lock-event-flow flow flex">
                <div className="section box">
                    <div className="title no-margin">Event Flow</div>
                    <div className="block">{ eventObjects }</div>
                </div>
            </div>
        )
    }
});

module.exports = LockEventFlow;

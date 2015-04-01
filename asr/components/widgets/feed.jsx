/**
 * @jsx React.DOM
 */

var React = require('react');
var moment = require('moment');

// inner class
var FeedItem = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {

        return (
            <li>
                <div style={{display:"inline-block"}}>
                    <img src={ this.props.user ? this.props.user.photo : "" }
                         height="24px" width="24px" style={{"borderRadius":"100%", marginRight:"10px"}}/>
                </div>
                <div style={{display:"inline-block"}}>
                <span className="user emp"
                      style={{'text-transform':'capitalize'}}>{ this.props.user ? this.props.user.name.first : "system" }</span>&nbsp;
                    <span>{ this.props.event.text }</span>

                    <div className="small">Missouri City,
                        TX &middot; { moment(this.props.event.created).fromNow() }</div>
                </div>
            </li>
        )
    }
});

var Feed = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {

        var self = this;

        var findUsernameById = function (id) {
            for (var i = 0; i < self.props.users.length; i++) {
                var user = self.props.users[i];
                if (user._id == id) {
                    return user;
                }
            }
        };

        var eventObjects = this.props.events.map(function (event) {
            return (
                <FeedItem key={event._id} event={event} user={ findUsernameById(event.user) }/>
            );
        });

        return (
            <div className="section box">
                <h2>Event Flow</h2>
                <ul className="list">{ eventObjects }</ul>
            </div>
        )
    }
});

module.exports = Feed;

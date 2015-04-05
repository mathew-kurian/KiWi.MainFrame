/**
 * @jsx React.DOM
 */

var React = require('react');
var moment = require('moment');
var event = require('./../../../constants/event');
var AccountStore = require('./../../stores/account-store');

// inner class
var FeedItem = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {

        var accountSrc = this.props.event.accountSrc;
        var accountDest = this.props.event.accountDest;
        var text = "Loading";
        var photo = "";
        var first = "";

        if (accountSrc) accountSrc = AccountStore.getAccount(accountSrc);
        if (accountDest) accountDest = AccountStore.getAccount(accountDest);

        var accountSrcReady = !!accountSrc._id;
        var accountDestReady = !!accountDest._id;

        if (accountSrc == "1") {
            photo = "System";
            first = "System";
        } else if (accountSrcReady) {
            photo = accountSrc.photo;
            first = accountSrc.name.first;
        }

        switch (this.props.event.event) {
            case event.key_remove:
                if (accountSrcReady) text = "Key access has been revoked from";
                break;
            case event.key_created:
                if (accountSrcReady) text = "Key access has been granted to";
                break;
            case event.key_edit:
                if (accountSrcReady) text = "Key access has been edited by for";
                break;
            case event.lock_created:
                if (accountSrcReady) text = "Lock has been created";
                break;
            case event.lock_edit:
                if (accountSrcReady) text = "Lock has been modified";
                break;
            case event.lock_registered:
                if (accountSrcReady) text = "Lock has been registered";
                break;
        }

        return (
            <li>
                <div style={{display:"inline-block"}}>
                    <img src={ photo }
                         height="24px" width="24px" style={{"borderRadius":"100%", marginRight:"10px"}}/>
                </div>
                <div style={{display:"inline-block"}}>
                <span className="user emp"
                      style={{'text-transform':'capitalize'}}>{ first }</span>&nbsp;
                    <span>{ text }</span>

                    <div className="small">Austin,
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

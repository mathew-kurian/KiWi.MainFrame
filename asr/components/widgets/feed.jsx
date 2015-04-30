/**
 * @jsx React.DOM
 */

var React = require('react');
var moment = require('moment');
var event = require('./../../../constants/event');
var AccountStore = require('./../../stores/account-store');
var util = require('util');

// inner class
var FeedItem = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {

        var accountSrc = this.props.event.accountSrc;
        var accountDest = this.props.event.accountDest;
        var text = "";

        if (!accountSrc) return ( <div></div>);

        if (accountSrc && accountSrc != 1) accountSrc = AccountStore.getAccount(accountSrc);
        if (accountDest) accountDest = AccountStore.getAccount(accountDest);

        if (accountSrc == 1) {
            accountSrc = {
                name: {first: "System"},
                photo: "https://cdn2.iconfinder.com/data/icons/web-icons/512/Gear-512.png"
            }
        }

        if (!accountSrc) {
            accountSrc = {
                name: {first: "Loading..."},
                last: "",
                photo: "http://jimpunk.net/Loading/wp-content/uploads/loading18.gif"
            }
        }

        if (!accountDest) {
            accountDest = {
                name: {first: "Loading..."},
                last: "",
                photo: "http://jimpunk.net/Loading/wp-content/uploads/loading18.gif"
            }
        }

        switch (this.props.event.event) {
            case event.key_remove:
                text = util.format("Key access has been revoked from %s by %s", accountSrc.name.first, accountDest.name.first);
                break;
            case event.key_created:
                text = util.format("Key access has been granted to %s by %s", accountDest.name.first, accountSrc.name.first);
                break;
            case event.key_edit:
                text = util.format("Key access has been edited by for %s by %s", accountSrc.name.first, accountDest.name.first);
                break;
            case event.lock_created:
                text = util.format("Lock created by %s", accountSrc.name.first);
                break;
            case event.lock_edit:
                text = util.format("Lock edited by %s", accountSrc.name.first);
                break;
            case event.lock_unlock_command_success:
                text = util.format("Unlock command received by base station successfully");
                break;
            case event.lock_unlock_command_fail:
                text = util.format("Unlock command received by base station but failed");
                break;
            case event.lock_unlock_command:
                text = util.format("Unlocked by %s", accountSrc.name.first);
                break;
            case event.lock_lock_command:
                text = util.format("Locked by %s", accountSrc.name.first);
                break;
            case event.lock_lock_command_success:
                text = util.format("Lock command received by base station successfully");
                break;
            case event.lock_lock_command_fail:
                text = util.format("Unlock command received by base station but failed");
                break;
            case event.lock_registered:
                text = util.format("Lock registered by base station");
                break;
        }

        return (
            <li>
                <div style={{display:"inline-block"}}>
                    <img src={ accountSrc.photo }
                         height="24px" width="24px" style={{"borderRadius":"100%", marginRight:"10px"}}/>
                </div>
                <div style={{display:"inline-block"}}>
                <span className="user emp"
                      style={{'text-transform':'capitalize'}}>{ accountSrc.first }</span>&nbsp;
                    <span>{ text }</span>

                    <div className="small">Austin,
                        TX &middot; { moment(this.props.event.created).fromNow() } &middot; { "E" + this.props.event.event }</div>
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

        var eventObjects = this.props.events.map(function (event) {
            return (
                <FeedItem key={event._id} event={event}/>
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

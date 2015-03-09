/**
 * @jsx React.DOM
 */

var React = require('react');
var moment = require('moment');
var UIUtils = require('./../../utils/ui-utils');

// inner class
var UserItem = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {
        var self = this;

        var pictureStyle = {
            'background-image': 'url(' + this.props.user.photo + ')'
        };

        return (
            <div className="section user">
                <div className="inner-top">
                    <div className="photo" style={ pictureStyle }></div>
                    <div className="details">
                        <div className="location">{ this.props.user.location.state }</div>
                        <div className="side">
                            <div className="name">{ this.props.user.name.first + " " + this.props.user.name.last }</div>
                            <div className="tag">Owner</div>
                        </div>
                    </div>
                    <div className="button small">
                        <div className="label">DISABLE</div>
                    </div>
                </div>
                <div className="inner-bottom">
                    <div className="detail mobile box">
                        <span className="icon phone"></span>{ this.props.user.mobile }</div>
                    <div className="detail email box">
                        <span className="icon email"></span>{ this.props.user.email }</div>
                    <div className="detail last-active box">
                        <span className="icon clock"></span>{ moment(this.props.user.created).fromNow() }</div>
                    <div className="icon menu-dot-horizontal more box"></div>
                </div>
            </div>
        )
    }
});

var LockUserFlow = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {
        var self = this;

        var userObjects = this.props.pairedUsers.map(function (uid) {
            return (
                <UserItem uid={uid} user={ UIUtils.findObjectById(self.props.users, uid) }/>
            );
        });

        return (
            <div className="lock-user-flow flow">
                <div className="lock-user-add flex">
                    <div className="section box">
                        <div className="title">Add User</div>
                        <div className="flex">
                            <div className="input-wrap box">
                                <input className="input" placeholder="@username"/>
                                <div className="description">To provide access to another user, add them to the lock.</div>
                            </div>
                            <div className="box button small">
                                <div className="label">Add</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex vertical lock-user-view">{ userObjects }</div>
            </div>
        )
    }
});

module.exports = LockUserFlow;

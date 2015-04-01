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
        return (
            <div className="account-wrapper flex">
                <div className="pic" style={{'background-image': 'url(' + this.props.user.photo + ')'}}></div>
                <div className="name">{ this.props.user.name.first + " " + this.props.user.name.last }</div>
                <div className="more box">1</div>
            </div>
        )
    }
});

var Users = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {
        var self = this;

        var userObjects = this.props.pairedUsers.map(function (uid) {
            return (
                <UserItem key={uid} uid={uid} user={ UIUtils.findObjectById(self.props.users, uid) }/>
            );
        });

        return (
            <div>
                <div style={{background:"#E2E6E9", padding: "20px"}}>
                    <div
                        style={{textAlign:"center",color:"#888", fontSize: "12px",textTransform:"uppercase", "marginLeft": "-70px"}}>
                        manage
                        user settings
                    </div>
                    <div className="weighted-input">
                        <input placeholder="enter a username"/>

                        <div className="icon emergency"
                             style={{color:"#19AAC7",fontSize:"20px",position:"absolute",right:"17px", top:"13px"}}></div>
                        <button style={{right:"-55px",position:"absolute", top:"6px", padding: "10px"}}>
                            <div className="icon add" style={{lineHeight:"20px"}}></div>
                        </button>
                    </div>
                </div>
                <div style={{position: "absolute", top:"129px", left: 0, right: 0, bottom: 0}}>
                    <div className="inset">
                        <div className="flex">
                            <div className="section box"
                                 style={{"max-width": "400px", "border-right": "1px solid #DDD", "padding-right": "20px", marginLeft: 0}}>
                                <h2>Accounts</h2>
                                { userObjects }
                            </div>
                            <div className="section box">
                                <h2>Details</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Users;

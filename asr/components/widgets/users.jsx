/**
 * @jsx React.DOM
 */

var React = require('react');
var moment = require('moment');
var UIUtils = require('./../../utils/ui-utils');
var LockStore = require('./../../stores/lock-store');
var AccountStore = require('./../../stores/account-store');

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

    handleClick: function(){
        LockStore.addKey(this.props.lock, this.state.newUser);
    },
    render: function () {
        var self = this;
        var peers = LockStore.getPeers(this.props.lock);
        var userObjects = !peers ? <div></div> : peers.map(function (uid) {
            return (
                <UserItem key={uid} uid={uid} user={ AccountStore.getAccount(uid) }/>
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
                        <input placeholder="enter a username" onChange={UIUtils.validate(this, 'newUser') }/>

                        <div className="icon emergency"
                             style={{color:"#19AAC7",fontSize:"20px",position:"absolute",right:"17px", top:"13px"}}></div>
                        <button style={{right:"-55px",position:"absolute", top:"6px", padding: "10px"}} onClick={this.handleClick}>
                            <div className="icon add" style={{lineHeight:"20px"}}></div>
                        </button>
                    </div>
                </div>
                <div style={{position: "absolute", top:"129px", left: 0, right: 0, bottom: 0}}>
                    <div className="inset">
                        <div className="flex">
                            <div className="section box"
                                 style={{smarginLeft: 0}}>
                                <h2>Accounts</h2>
                                { userObjects }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Users;

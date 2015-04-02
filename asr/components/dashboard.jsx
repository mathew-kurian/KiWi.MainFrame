/**
 * @jsx React.DOM
 */

var Reflux = require('reflux');
var React = require('react');
var Banner = require('./banner.jsx');
var tools = require('./../../libs/tools');
var Feed = require('./widgets/feed.jsx');
var Users = require('./widgets/users.jsx');
var AppActions = require('./../actions/app-actions');
var LockStore = require('./../stores/lock-store');
var Controls = require('./widgets/controls.jsx');
var Statistics = require('./widgets/statistics.jsx');
var UIUtils = require('./../utils/ui-utils');
var TestDB = require('./../utils/test-utils').TestDB;

var tid = 0;

var LockItem = React.createClass({
    getInitialState: function () {
        return {
            active: false,
            name: "Undefined"
        }
    },
    onLockFocus: function () {
        this.props.onLockFocus(this.props.lock._id);
    },
    render: function () {
        return (
            <div className={ "device " + (this.props.active ? "active" : "")} onClick={this.onLockFocus}>
                <div className={ UIUtils.calcLightClasses(this.props.lock) }></div>
                <div className="name">{ this.props.lock.name }</div>
            </div>
        )
    }
});

var Dashboard = React.createClass({
    mixins: [Reflux.connect(LockStore, "locks")],
    getInitialState: function () {
        return {
            title: "dashboard",
            logo: "hello",
            message: "hello",
            flowClass: "lock-event-flow",
            users: [],
            lockItemSidebar: "",
            activeLock: undefined
        };
    },
    onLockNotify: function () {

        //var self = this;
        //var activeLock = self.state.activeLock;
        //activeLock.alert = true;
        //self.setState({activeLock: activeLock});
        //
        //setTimeout(function () {
        //    activeLock = self.state.activeLock;
        //    activeLock.alert = false;
        //    self.setState({activeLock: activeLock});
        //}, 500);
    },
    componentDidMount: function () {
        var self = this;
        var locks = TestDB.getLocks();
        var users = TestDB.getUsers();

        this.setState({users: users});
        // this.setState({activeLock: locks[parseInt(locks.length * Math.random())]});

        var generateNotifications = function () {
            self.onLockNotify();
            tid = setTimeout(generateNotifications, Math.random() * 3000);
        };

        generateNotifications();
    },
    componentWillUnmount: function () {
        clearTimeout(tid);
    },
    onLockEdit: function (opts) {
        AppActions.renameLock(this.state.activeLock._id, opts.name);
    },
    onLockFocus: function (id) {
        this.setState({activeLock: this.state.locks[id]});
    },
    renderLocks: function () {
        var locks = [];

        for (var _id in this.state.locks) {
            var lock = this.state.locks[_id];
            locks.push(
                <LockItem key={lock._id} lock={lock} onLockFocus={this.onLockFocus}
                          active={ this.state.activeLock && lock._id === this.state.activeLock._id }/>
            );
        }

        return locks;
    },
    handleAddLock: function () {
        var serial = prompt("Please enter the serial information of your lock. The serial can found in the back of the packaging.", "");
        if (serial) AppActions.createLock(serial);
    },
    render: function () {
        var self = this;

        var renderSection = function () {
            if (self.state.activeLock) {
                switch (self.state.flowClass) {
                    default:
                        return null;
                    case "lock-event-flow" :
                        return (
                            <div className="inset">
                                <Statistics />

                                <div className="flex">
                                    <Controls />
                                    <Feed users={ self.state.users || [] }
                                          events={ [] }/>
                                </div>
                            </div>
                        );
                    case "lock-user-flow" :
                        return <Users users={ self.state.users || [] }
                                      pairedUsers={ self.state.activeLock.pairedUsers }/>;
                }
            }
            return null;
        };

        var showEventFlow = function () {
            self.state.flowClass = "lock-event-flow";
            self.forceUpdate();
        };
        var showUserFlow = function () {
            self.state.flowClass = "lock-user-flow";
            self.forceUpdate();
        };
        var showSettingsFlow = function () {
            self.state.flowClass = "lock-settings-flow";
            self.forceUpdate();
        };
        var toggleLockItemSidebar = function () {
            self.state.lockItemSidebar = self.state.lockItemSidebar ? "" : "expand";
            self.forceUpdate();
        };

        var locks = this.renderLocks();

        return (
            <div className="main">
                <section className="left">
                    <div>
                        { locks.length ?
                            <div>
                                <div className="group">
                                    <div className="clicker blue">
                                        <div className="icon lock"></div>
                                        <div className="label">Active Locks</div>
                                    </div>
                                </div>
                                <div className="group">
                                    <div className="locks">{ locks }</div>
                                </div>
                            </div> : null
                        }
                        { locks.length ?
                            <div className="group">
                                <div className="clicker green rounded" onClick={ this.handleAddLock }>
                                    <div className="icon plus"></div>
                                    <div className="label">Add Lock</div>
                                </div>
                            </div> :
                            <div className="group" style={{padding:"10px"}}>
                                <div style={{borderRadius:"4px", background:"#465617",padding:"10px"}}>
                                    <div>
                                        <div className="icon emergency"
                                             style={{fontSize: "20px", marginRight: "8px",color: "rgb(164, 212, 18)"}}></div>
                                        <span style={{fontWeight: "bold", color: "rgb(164, 212, 18)"}}>Note</span>
                                    </div>
                                    <h3 style={{color: "#fff", fontWeight: "normal", fontSize: "11px", textAlign: "center"}}>
                                        You have no locks at
                                        the moment</h3>

                                    <div className="clicker green rounded" onClick={ this.handleAddLock }
                                         style={{margin:0, width: "100%"}}>
                                        <div className="icon plus"></div>
                                        <div className="label">Add Lock</div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </section>
                <section className={"right " + this.state.lockItemSidebar }>
                    <div className="sidebar">
                        <div>
                            <div onClick={ showEventFlow }
                                 className={ UIUtils.checkJoin("icon dashboard", this.state.flowClass, "lock-event-flow", " active") }></div>
                            <div onClick={ showUserFlow }
                                 className={ UIUtils.checkJoin("icon users", this.state.flowClass, "lock-user-flow", " active") }></div>
                            <div onClick={ showSettingsFlow }
                                 className={ UIUtils.checkJoin("icon settings", this.state.flowClass, "lock-settings-flow", " active") }></div>
                            <div onClick={ toggleLockItemSidebar } className="icon menu bottom"></div>
                        </div>
                    </div>
                    { this.state.activeLock ?
                        <Banner lock={ this.state.activeLock } onLockEdit={this.onLockEdit}/> : null }
                    <div className="content">
                        { renderSection() }
                    </div>
                </section>
            </div>
        )
    }
});

module.exports = Dashboard;

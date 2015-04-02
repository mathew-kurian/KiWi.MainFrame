/**
 * @jsx React.DOM
 */

var React = require('react');
var UIUtils = require('./../utils/ui-utils');
var $ = require('jquery');

var LockBanner = React.createClass({

    getInitialState: function () {
        return {}
    },
    onLockRename: function (e) {
        this.props.onLockEdit({name: e.target.textContent});
    },
    render: function () {
        return (
            <div className="banner">
                <div className="name"><span className="pre">Lock</span> <span
                    className="cen" contentEditable="true"
                    onInput={ this.onLockRename }>{ this.props.lock.name }</span> { !this.props.lock._private.registered ?
                    <span
                        style={{ fontWeight: "bold",fontSize: "14px", opacity: 0.5, textTransform: "uppercase"}}>unregistered</span> : null }
                </div>
            </div>
        )
    }
});

module.exports = LockBanner;

/**
 * @jsx React.DOM
 */

var React = require('react');

var LockBanner = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {
        return (
            <div className="banner">
                <div className="name"><span className="pre">Lock</span> <span className="cen">{ this.props.lock.name }</span></div>
            </div>
        )
    }
});

module.exports = LockBanner;

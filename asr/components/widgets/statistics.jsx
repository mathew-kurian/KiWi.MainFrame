/**
 * @jsx React.DOM
 */

var React = require('react');

var Statistics = React.createClass({

    getInitialState: function () {
        return null;
    },

    render: function () {
        return (
            <div className="section">
                <h1>Statistics</h1>
                <div className="stats-table flex">
                    <div className="cell box">
                        <div className="label">
                            <div className="icon dashboard"></div>
                            <div className="text">System Health</div>
                            <div className="desc">Year 2015</div>
                        </div>
                        <div className="value">100%</div>
                    </div>
                    <div className="cell box">
                        <div className="label">
                            <div className="icon battery"></div>
                            <div className="text">Battery Left</div>
                            <div className="desc">Changed 3 months ago</div>
                        </div>
                        <div className="value">15 days</div>
                    </div>
                    <div className="cell box">
                        <div className="label">
                            <div className="icon wifi"></div>
                            <div className="text">Wireless Strength</div>
                            <div className="desc">Recommended > 85%</div>
                        </div>
                        <div className="value">97%</div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Statistics;

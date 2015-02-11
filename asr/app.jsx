/**
 * @jsx React.DOM
 */

/**
 *
 * It uses `<Dashboard/>` to render the app on the server. You can create isomorphic apps by rendering React on both Server
 * and Client.
 */

var React = require('react');
var Dashboard = require('./components/dashboard.jsx');

var App = React.createClass({
    render: function () {
        return (
            <html>
                <head lang="en">
                    <base href="/"/>
                    <meta charSet="utf-8"/>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <title>React Note app</title>
                    <link href="css/bootstrap.css" rel="stylesheet"/>
                    <link href="css/app.css" rel="stylesheet"/>
                </head>
                <body>
                    <Dashboard/>
                    <script type="text/javascript" src="/js/browserify/bundle.js"></script>
                    <script src="js/bootstrap.js"></script>
                </body>
            </html>
        )
    }
});


module.exports = App;
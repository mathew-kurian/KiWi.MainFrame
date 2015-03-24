/**
 * @jsx React.DOM
 */

/**
 *
 * It uses `<Dashboard/>` to render the app on the server. You can create isomorphic apps by rendering React on both Server
 * and Client.
 */

var React = require('react');
var Login = require('./components/login.jsx');
var NotificationCenter = require('./components/notification-center.jsx');

var App = React.createClass({
    render: function () {
        return (
            <html>
                <head lang="en">
                    <base href="/"/>
                    <meta charSet="utf-8"/>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <link href='http://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic' rel='stylesheet' type='text/css'/>
                    <link href='/css/app.css' rel='stylesheet' type='text/css'/>
                    <title>Kiwi Control - Dashboard</title>
                </head>
                <body>
                    <NotificationCenter />
                    <Login/>
                    <script type="text/javascript" src="/js/bundle.js"></script>
                </body>
            </html>
        )
    }
});


module.exports = App;
/**
 * @jsx React.DOM
 */

/**
 *  For rendering the app on client side.
 */
var React = require('react');
var App = require('./app.jsx');

if (typeof window !== 'undefined') {

    window.onload = function () {
        React.renderComponent(App(), document);
    };

    window.React = React;
}
/**
 * @jsx React.DOM
 */

/**
 *  For rendering the app on client side.
 */
var React = require('react');
var App = require('./app.jsx');
var $ = require('jquery');

if (typeof window !== 'undefined') {

    window.onload = function () {
        React.renderComponent(App(), document);
    };

    window.notify = function () {
        console.log(arguments[0]);
    };

    $('.prevent-default').on('click', function (event) {
        event.preventDefault();
    });

    $('.button, button').on('click', function (event) {
        event.preventDefault();

        var $div = $('<div/>'),
            btnOffset = $(this).offset(),
            xPos = event.pageX - btnOffset.left,
            yPos = event.pageY - btnOffset.top;

        $div.addClass('ripple-effect');
        var $ripple = $(".ripple-effect");

        $ripple.css("height", $(this).height());
        $ripple.css("width", $(this).height());
        $div
            .css({
                top: yPos - ($ripple.height() / 2),
                left: xPos - ($ripple.width() / 2),
                background: $(this).data("ripple-color")
            })
            .appendTo($(this));

        window.setTimeout(function () {
            $div.remove();
        }, 2000);
    });


    window.React = React;
}
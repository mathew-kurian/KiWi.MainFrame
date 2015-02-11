/**
 * @jsx React.DOM
 */

var React = require('react');

var Dashboard = React.createClass({

    getInitialState: function () {
        return {id: null}
    },

    onEdit: function (id) {
        this.setState({currentlyEdited: id});
    },

    onAdd: function () {
        this.setState({currentlyEdited: null});
    },

    render: function () {
        return (
            <div className="container">
                <div className="row header">
                    <div className="page-header">
                        <h1>React Note App</h1>
                    </div>
                </div>
                <div className="row">
                    <NoteListBox onEdit={this.onEdit} onAdd={this.onAdd}/>
                    <NoteCreationBox id={this.state.currentlyEdited} />
                </div>
            </div>
        )
    }
});

module.exports = Dashboard;

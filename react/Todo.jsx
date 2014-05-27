/** @jsx React.DOM */
define(['React'], function (React) {
  var TodoItem = React.createClass({
    onClick: function () {
      this.props.emitEvent('remove', this.props.key);
    },
    render: function () {
      return <li onClick={this.onClick}>{ this.props.text }</li>;
    }
  });
   
   var TodoList = React.createClass({
     render: function () {
       return (
         <ul>
           { this.props.items.map(function (item) {
             return <TodoItem key={ item.id } emitEvent={ this.props.emitEvent } text={ item.text }></TodoItem>;
           }, this) }
         </ul>
       );
     }
   });
   
   return React.createClass({
     getInitialState: function () {
       return {
         text: '',
         items: []
       };
     },
     getDefaultProps: function () {
       return {
         emitEvent: function () {}
       };
     },
     componentWillReceiveProps: function (newProps) {
       if (!newProps.items) {
         return;
       }
       this.setState({
         items: Object.keys(newProps.items).map(function (id) {
           return newProps.items[id];
         })
       });
     },
     onText: function (e) {
       this.setState({ text: e.target.value });
     },
     handleSubmit: function (e) {
       e.preventDefault();
       this.props.emitEvent('create', this.state.text);
       this.setState({ text: '' });
     },
     render: function () {
       return (
       <div>
         <h3>TODO</h3>
         <TodoList items={ this.state.items} emitEvent={ this.props.emitEvent }></TodoList>
         <form onSubmit={ this.handleSubmit }>
           <input onChange={ this.onText } value={ this.state.text }></input>
           <button>{"Add #" + (this.state.items.length + 1)}</button>
         </form>
       </div>
       );
     }
   });
});

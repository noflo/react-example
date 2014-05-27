/** @jsx React.DOM */
define(['React'], function (React) {
  var TodoItem = React.createClass({displayName: 'TodoItem',
    onClick: function () {
      this.props.emitEvent('remove', this.props.key);
    },
    render: function () {
      return React.DOM.li( {onClick:this.onClick},  this.props.text );
    }
  });
   
   var TodoList = React.createClass({displayName: 'TodoList',
     render: function () {
       return (
         React.DOM.ul(null, 
            this.props.items.map(function (item) {
             return TodoItem( {key: item.id,  emitEvent: this.props.emitEvent,  text: item.text });
           }, this) 
         )
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
       React.DOM.div(null, 
         React.DOM.h3(null, "TODO"),
         TodoList( {items: this.state.items, emitEvent: this.props.emitEvent }),
         React.DOM.form( {onSubmit: this.handleSubmit }, 
           React.DOM.input( {onChange: this.onText,  value: this.state.text }),
           React.DOM.button(null, "Add #" + (this.state.items.length + 1))
         )
       )
       );
     }
   });
});

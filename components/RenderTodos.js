noflo = require 'noflo'

{ul, li, div, h3, form, input, button} = React.DOM

TodoItem = React.createClass
  onClick: ->
    @props.remove @props.key
  render: ->
    (li {
      onClick: @onClick
    }, [@props.text])

TodoList = React.createClass
  handleRemove: (e) ->
    console.log e
  render: ->
    createItem = (item) =>
      (TodoItem {
        key: item.id
        text: item.text
        remove: @props.remove
       })
    (ul {
      onClick: @handleRemove
     }, [@props.items.map createItem])

TodoApp = React.createClass
  getInitialState: ->
    text: ''
    items: []
    
  componentWillReceiveProps: (newProps) ->
    console.log newProps
    return unless newProps.items
    @setState
      items: Object.keys(newProps.items).map (id) ->
        newProps.items[id]

  onText: (e) ->
    @setState
      text: e.target.value

  handleSubmit: (e) ->
    e.preventDefault()
    @props.add this.state.text
    @setState
      text: ''

  render: ->
    (div {}, [
      (h3 {key: 'header'}, ['TODO']),
      (TodoList {items: @state.items, key: 'list', remove: @props.remove})
      (form {onSubmit: @handleSubmit, key: 'form'}, [
        (input {onChange: @onText, value: @state.text}),
        (button {}, ['Add #' + (@state.items.length + 1)])
      ])
    ])

class RenderTodos extends noflo.Component
  icon: 'html5'
  constructor: ->
    @store = null
    @component = null
    @inPorts = new noflo.InPorts
      container:
        datatype: 'object'
      items:
        datatype: 'object'
    @outPorts = new noflo.OutPorts
      event:
        datatype: 'string'

    @inPorts.container.on 'data', (container) =>
      @renderComponent container, @store
    @inPorts.items.on 'data', (store) =>
      @setStore store
      
  setStore: (store) ->
    @store = store
    unless @component
      @renderComponent container, @store
      return
    @component.setProps
      items: @store

  handleAdd: (text) =>
    @outPorts.event.beginGroup 'create'
    @outPorts.event.send text
    @outPorts.event.endGroup()
    @outPorts.event.disconnect()

  handleRemove: (id) =>
    @outPorts.event.beginGroup 'delete'
    @outPorts.event.send id
    @outPorts.event.endGroup()
    @outPorts.event.disconnect()
    
  renderComponent: (container, store) ->
    @component = React.renderComponent (TodoApp {
      add: @handleAdd
      remove: @handleRemove
      store: store
    }), container

exports.getComponent = -> new RenderTodos
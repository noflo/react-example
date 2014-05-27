define [
  'React'
], (React) ->
  {ul, li, div, h3, form, input, button} = React.DOM

  TodoItem = React.createClass
    onClick: ->
      @props.emitEvent 'remove', @props.key
    render: ->
      (li {
        onClick: @onClick
      }, [@props.text])

  TodoList = React.createClass
    render: ->
      createItem = (item) =>
        (TodoItem {
          key: item.id
          text: item.text
          emitEvent: @props.emitEvent
         })
      (ul {}, [@props.items.map createItem])

  TodoApp = React.createClass
    getInitialState: ->
      text: ''
      items: []
      
    componentWillReceiveProps: (newProps) ->
      return unless newProps.items
      @setState
        items: Object.keys(newProps.items).map (id) ->
          newProps.items[id]

    onText: (e) ->
      @setState
        text: e.target.value

    handleSubmit: (e) ->
      e.preventDefault()
      @props.emitEvent 'create', this.state.text
      @setState
        text: ''

    render: ->
      (div {}, [
        (h3 {key: 'header'}, ['TODO']),
        (TodoList {items: @state.items, key: 'list', emitEvent: @props.emitEvent})
        (form {onSubmit: @handleSubmit, key: 'form'}, [
          (input {onChange: @onText, value: @state.text}),
          (button {}, ['Add #' + (@state.items.length + 1)])
        ])
      ])

  return TodoApp

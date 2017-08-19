import React, { Component } from 'react';

export default class EditableText extends Component {
  constructor() {
    super();
    this.state = { editing: false };
  }

  handleSubmit(e) {
    this.setState({ editing: false });
    this.props.onSubmit(this.state.currentValue);
    e.preventDefault();
  }

  handleChange(e) {
    this.setState({ currentValue: e.target.value });
  }

  handleFocus(e) {
    e.target.select();
  }

  handleDoubleClick() {
    this.setState({ editing: true });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.editing) return;
    this.setState({
      currentValue: nextProps.value
    });
  }

  render() {
    return (
      <span>
        { !this.state.editing && (
          <strong onDoubleClick={this.handleDoubleClick.bind(this)}>
            { this.props.value }
          </strong>
        )}
        { this.state.editing && (
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input type="text"
              autoFocus
              onFocus={this.handleFocus}
              value={this.state.currentValue}
              onChange={this.handleChange.bind(this)}
            />
          </form>
        )}
      </span>
    );
  }
}

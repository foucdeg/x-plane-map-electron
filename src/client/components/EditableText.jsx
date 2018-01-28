import React, { Component } from 'react';
import PropTypes from 'prop-types';

const handleFocus = e => e.target.select();

class EditableText extends Component {
  constructor() {
    super();
    this.state = { editing: false };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.editing) return;
    this.setState({
      currentValue: nextProps.value,
    });
  }

  handleSubmit(e) {
    this.setState({ editing: false });
    this.props.onSubmit(this.state.currentValue);
    e.preventDefault();
  }

  handleChange(e) {
    this.setState({ currentValue: e.target.value });
  }

  handleReset() {
    this.setState({
      editing: false,
      currentValue: this.props.value,
    });
  }

  handleClick(e) {
    e.stopPropagation();
    this.setState({ editing: true });
  }

  renderStatic() {
    return (
      <strong onClick={this.handleClick} style={{ cursor: 'text' }} title="Click to edit">
        {this.props.value}
      </strong>
    );
  }

  renderEditing() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          autoFocus
          onFocus={handleFocus}
          value={this.state.currentValue}
          onChange={this.handleChange}
          onBlur={this.handleReset}
        />
      </form>
    );
  }

  render() {
    return this.state.editing ? this.renderEditing() : this.renderStatic();
  }
}

EditableText.propTypes = {
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditableText;

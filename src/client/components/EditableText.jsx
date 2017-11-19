import React, { Component } from 'react';
import PropTypes from 'prop-types';

const handleFocus = e => e.target.select();

class EditableText extends Component {
  constructor() {
    super();
    this.state = { editing: false };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
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

  handleDoubleClick() {
    this.setState({ editing: true });
  }

  render() {
    return (
      <span>
        { !this.state.editing && (
          <strong onDoubleClick={this.handleDoubleClick}>
            { this.props.value }
          </strong>
        )}
        { this.state.editing && (
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              autoFocus
              onFocus={handleFocus}
              value={this.state.currentValue}
              onChange={this.handleChange}
            />
          </form>
        )}
      </span>
    );
  }
}

EditableText.propTypes = {
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditableText;

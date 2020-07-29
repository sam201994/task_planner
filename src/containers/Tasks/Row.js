import React from 'react';
import {FiMove, FiArrowLeft, FiArrowRight} from 'react-icons/fi';
import {AiOutlineDelete} from 'react-icons/ai';

import Utils from '../../utils';
import './Tasks.css';

class Row extends React.PureComponent {
  state = {
    isInputActive: false,
    value: this.props.item.value,
  };

  handleTextClick = (e, isVisible) => {
    e.stopPropagation();
    const {isInputActive, value} = this.state;
    const {handleSubmitNewText, index, item} = this.props;
    this.setState({
      isInputActive: isVisible,
    });
    if (isInputActive) {
      handleSubmitNewText(index, {id: item.id, value});
    }
  };

  handleOnChangeText = e => {
    this.setState({
      value: e.target.value,
    });
  };

  renderText = color => {
    const {isInputActive, value} = this.state;
    return (
      <div
        className="row-text"
        style={{color}}
        onClick={e => this.handleTextClick(e, true)}>
        {isInputActive ? (
          <input type="text" name="name" onChange={this.handleOnChangeText} />
        ) : (
          value
        )}
      </div>
    );
  };

  render() {
    const {
      onClickMove,
      onClickIndent,
      onClickOutdent,
      onClickDelete,
      indentValue,
      index,
      prevIndexIndentValue,
      nextIndexIndentValue,
    } = this.props;
    const isInDentDisabled =
      index === 0 || indentValue - prevIndexIndentValue === 1;
    const isOutdentDisabled = index === 0 || indentValue === 0;
    const color = Utils.getColor(indentValue);
    return (
      <div className="row-main-container">
        <div className="row-actions-container">
          <div className="action-button" onClick={onClickMove}>
            <FiMove />
          </div>
          <div
            className="action-button"
            style={
              isOutdentDisabled
                ? {pointerEvents: 'none', color: 'lightgrey'}
                : {}
            }
            onClick={() =>
              onClickOutdent(index, indentValue, nextIndexIndentValue)
            }>
            <FiArrowLeft />
          </div>
          <div
            className="action-button"
            style={
              isInDentDisabled
                ? {pointerEvents: 'none', color: 'lightgrey'}
                : {}
            }
            onClick={() =>
              onClickIndent(index, indentValue, nextIndexIndentValue)
            }>
            <FiArrowRight />
          </div>
          <div
            className="action-button"
            onClick={() =>
              onClickDelete(index, indentValue, nextIndexIndentValue)
            }>
            <AiOutlineDelete />
          </div>
        </div>
        <div
          className="row-text-container"
          onClick={e => this.handleTextClick(e, false)}>
          <div
            className="indent-pad"
            style={{marginLeft: indentValue * 30, borderColor: color}}
          />
          {this.renderText(color)}
        </div>
      </div>
    );
  }
}

export default Row;

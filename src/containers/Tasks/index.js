import React from 'react';
import {IoIosAddCircleOutline} from 'react-icons/io';

import Utils from '../../utils';
import Row from './Row';
import './Tasks.css';

const map = [0, 1, 0, 1, 2];
const texts = [
  {id: 'a1', value: 'Numbers'},
  {id: 'a2', value: 'count to determine the number of objects in a set'},
  {id: 'a3', value: 'Measurement'},
  {id: 'a4', value: 'Use simple fraction names in real-life situations'},
  {
    id: 'a5',
    value:
      'describe observations about events and objects in real-life situations',
  },
];

class Tasks extends React.PureComponent {
  constructor(props) {
    super(props);
    const lastIndentValue = map[map.length - 1];
    this.state = {
      data: texts,
      indentValues: map,
      lastIndentValue,
      counter: 0,
    };
  }

  renderRows = () => {
    const {data, indentValues} = this.state;
    const totalDataLength = data.length;
    return data.map((item, index) => {
      let prevIndexIndentValue = -1;
      let nextIndexIndentValue = 0;
      if (index > 0) prevIndexIndentValue = indentValues[index - 1];
      if (index < totalDataLength + 1)
        nextIndexIndentValue = indentValues[index + 1];
      return (
        <Row
          key={item.id}
          item={item}
          onClickIndent={this.onClickIndent}
          onClickOutdent={this.onClickOutdent}
          onClickDelete={this.onClickDelete}
          handleSubmitNewText={this.handleSubmitNewText}
          indentValue={indentValues[index]}
          index={index}
          prevIndexIndentValue={prevIndexIndentValue}
          nextIndexIndentValue={nextIndexIndentValue}
        />
      );
    });
  };

  renderTitle = () => {
    const {title} = this.props;
    return <div className="header-title">{title}</div>;
  };

  renderHeader = () => {
    return (
      <div className="header-container">
        <div className="left-col-header">
          <div className="header-main-title">Actions</div>
          <div className="header-sub-title">Move, Ident, Outdent, Delete</div>
        </div>
        <div className="right-col-header">
          <div className="header-main-title">Standard</div>
          <div className="header-sub-title">Text of the standard</div>
        </div>
      </div>
    );
  };

  handleSubmitNewText = (index, item) => {
    const {data} = this.state;
    const newData = [...data];
    newData[index] = item;
    this.setState({
      data: newData,
    });
  };

  handleOnAdd = () => {
    const {lastIndentValue, data, indentValues, counter} = this.state;
    const key = `b${counter + 1}`;
    this.setState({
      data: [...data, {id: key, value: 'Type text here ...'}],
      indentValues: [...indentValues, lastIndentValue],
      counter: counter + 1,
    });
  };

  onClickDelete = (index, indentValue, nextIndexIndentValue) => {
    const {data, indentValues} = this.state;
    const newData = Utils.deleteItem(
      index,
      indentValue,
      nextIndexIndentValue,
      data,
      indentValues
    );
    this.setState({
      data: newData.data,
      indentValues: newData.indentValues,
      lastIndentValue: newData.lastIndentValue,
    });
  };

  renderButton = () => {
    return (
      <div className="button-container" onClick={this.handleOnAdd}>
        <div className="button-icon">
          <IoIosAddCircleOutline color="white" />
        </div>
        <div className="button-text">Add a standard</div>
      </div>
    );
  };

  onClickIndent = (index, indentValue, nextIndexIndentValue) => {
    const {indentValues} = this.state;
    const newData = Utils.transformDataOnIndent(
      index,
      indentValue,
      nextIndexIndentValue,
      indentValues
    );
    this.setState({
      indentValues: newData.indentValues,
      lastIndentValue: newData.lastIndentValue,
    });
  };

  onClickOutdent = (index, indentValue, nextIndexIndentValue) => {
    const {indentValues} = this.state;
    const newData = Utils.transformDataOutdent(
      index,
      indentValue,
      nextIndexIndentValue,
      indentValues
    );
    this.setState({
      indentValues: newData.indentValues,
      lastIndentValue: newData.lastIndentValue,
    });
  };

  handleExport = () => {
    const {data, indentValues} = this.state;
    Utils.transformAndDownloadfile(data, indentValues, 'tasks');
  };

  readJsonFile = event => {
    const reader = new FileReader();
    reader.onload = this.onReaderLoad;
    reader.readAsText(event.target.files[0]);
  };

  onReaderLoad = event => {
    try {
      const obj = JSON.parse(event.target.result);
      const {newData, indentValues} = Utils.checkJsonObjFormat(obj);
      this.setState({
        data: newData,
        indentValues,
        lastIndentValue: 0,
      });
    } catch (e) {
      alert('Invalid Json format');
    }
  };

  handleClear = () => {
    this.setState({
      data: [],
      indentValues: [],
      lastIndentValue: 0,
    });
  };

  renderProcessButtons = () => {
    return (
      <div className="process-button-container">
        <div className="process-button" onClick={this.handleClear}>
          Clear
        </div>

        <div>
          <label htmlFor="file-upload" className="process-button">
            Import
          </label>
          <input
            onChange={this.readJsonFile}
            id="file-upload"
            type="file"
            accept="application/json"
          />
        </div>

        <div className="process-button" onClick={this.handleExport}>
          Export
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="main-container">
        {this.renderProcessButtons()}
        {this.renderTitle()}
        {this.renderHeader()}
        <div className="list-container">{this.renderRows()}</div>
        {this.renderButton()}
      </div>
    );
  }
}

export default Tasks;

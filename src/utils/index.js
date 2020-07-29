const ColorMap = ['#1bb0b3', 'black', 'grey', 'orange', '#00B3E6', 
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const getColor = index => ColorMap[index % 50];

const checkJsonObjFormat = obj => {
  if (!Array.isArray(obj)) throw 'Error';
  const newData = [];
  const indentValues = [];
  const indentValue = 0;
  let key = 0;
  function convertToArray(data, indentValue) {
    for (let i = 0; i < data.length; i++) {
      let value = data[i].value;
      let id = `a${key}`;
      newData.push({
        id,
        value,
      });
      indentValues.push(indentValue);
      key++;
      if (data[i].children) {
        convertToArray(data[i].children, indentValue + 1);
      }
    }
  }
  convertToArray(obj, indentValue);
  return {newData, indentValues};
};

const transformDataOnIndent = (
  index,
  indentValue,
  nextIndexIndentValue,
  indentValues
) => {
  let i = index;
  if (nextIndexIndentValue > indentValue) {
    for (i = index + 1; i < indentValues.length; i++) {
      const k = indentValues[i] - indentValues[i - 1];
      if (k < 0 || k > 1) {
        break;
      }
    }
  }

  if (i === index) {
    const newIndentValues = [...indentValues];
    newIndentValues[i] = indentValues[i] + 1;
    return {
      indentValues: newIndentValues,
      lastIndentValue: newIndentValues[newIndentValues.length - 1] || 0,
    };
  }

  const newIndentValues = indentValues.map((value, pos) => {
    if (pos >= index && pos < i) return value + 1;
    return value;
  });
  return {
    indentValues: newIndentValues,
    lastIndentValue: newIndentValues[newIndentValues.length - 1] || 0,
  };
};

const transformDataOutdent = (
  index,
  indentValue,
  nextIndexIndentValue,
  indentValues
) => {
  let i = index;
  if (nextIndexIndentValue > indentValue) {
    for (i = index + 1; i < indentValues.length; i++) {
      const k = indentValues[i] - indentValues[i - 1];
      if (k < 0 || k > 1) {
        break;
      }
    }
  }

  if (i === index) {
    const newIndentValues = [...indentValues];
    newIndentValues[i] = indentValues[i] - 1;
    return {
      indentValues: newIndentValues,
      lastIndentValue: newIndentValues[newIndentValues.length - 1] || 0,
    };
  }

  const newIndentValues = indentValues.map((value, pos) => {
    if (pos >= index && pos < i) return value - 1;
    return value;
  });
  return {
    indentValues: newIndentValues,
    lastIndentValue: newIndentValues[newIndentValues.length - 1] || 0,
  };
};

const deleteItem = (
  index,
  indentValue,
  nextIndexIndentValue,
  data,
  indentValues
) => {
  let i = index;
  if (nextIndexIndentValue > indentValue) {
    for (i = index + 1; i < data.length; i++) {
      if (indentValue === indentValues[i]) {
        break;
      }
    }
  }
  if (i === index) {
    const newData = data.filter((_, pos) => pos !== index);
    const newIndentValues = indentValues.filter((_, pos) => pos !== index);
    return {
      data: newData,
      indentValues: newIndentValues,
      lastIndentValue: newIndentValues[newIndentValues.length - 1] || 0,
    };
  }

  const newData = data.filter((_, pos) => {
    if (pos >= index && pos < i) return false;
    return true;
  });
  const newIndentValues = indentValues.filter((_, pos) => {
    if (pos >= index && pos < i) return false;
    return true;
  });

  return {
    data: newData,
    indentValues: newIndentValues,
    lastIndentValue: newIndentValues[newIndentValues.length - 1] || 0,
  };
};

const downloadFile = async (data, fileName) => {
  const json = JSON.stringify(data);
  const blob = new Blob([json], {type: 'application/json'});
  const href = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const transformAndDownloadfile = (data, indentValues, fileName) => {
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    const indentValue = indentValues[i];
    const dataToAdd = {value: data[i].value, children: []};
    const lastIndex = newData.length - 1;
    if (i === 0 || indentValue === 0) {
      newData.push(dataToAdd);
    } else {
      const prevIndentValue = indentValues[i - 1];
      let lastNode = newData[lastIndex];
      const newLastNode = processData(
        lastNode,
        indentValue,
        dataToAdd,
        prevIndentValue,
        indentValue
      );
      newData[lastIndex] = newLastNode;
    }
  }

  function processData(
    obj,
    indentValue,
    dataToAdd,
    prevIndentValue,
    currentIndentValue
  ) {
    if (indentValue === 0) {
      obj.children.push(dataToAdd);
      return obj;
    }
    const lastIndex = obj.children.length > 0 ? obj.children.length - 1 : 0;
    let newObj = obj;
    if (
      (indentValue === 1 && prevIndentValue === currentIndentValue) ||
      (prevIndentValue > currentIndentValue && indentValue === 1)
    ) {
      newObj = obj;
    } else {
      newObj = obj.children[lastIndex] || obj;
    }
    processData(newObj, indentValue - 1, dataToAdd);
    return obj;
  }
  downloadFile(newData, fileName);
};

export default {
  getColor,
  checkJsonObjFormat,
  transformDataOnIndent,
  transformDataOutdent,
  deleteItem,
  transformAndDownloadfile,
};

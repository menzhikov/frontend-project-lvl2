import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import format from './utils';

const encoding = 'utf8';
const states = { new: '+', old: '-', unchanged: ' ' };

const isValidConfig = (config) => {
  if (!_.isString(config) || config.length === 0) {
    return false;
  }

  const pathToFile = path.resolve(process.cwd(), config);
  if (!fs.existsSync(pathToFile) || fs.lstatSync(pathToFile).isDirectory()) {
    return false;
  }

  return true;
};

const genDiff = (firstConfig, secondConfig) => {
  if (!isValidConfig(firstConfig) || !isValidConfig(secondConfig)) {
    return '';
  }
  const objectBefore = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), firstConfig), encoding),
  );
  const objectAfter = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), secondConfig), encoding),
  );
  const uniqKeys = _.uniq([...Object.keys(objectBefore), ...Object.keys(objectAfter)]);
  const changes = uniqKeys.map((key) => {
    const hasObjectAfterKey = _.has(objectAfter, key);
    const hasObjectBeforeKey = _.has(objectBefore, key);
    const isEqualValuesByKey = objectAfter[key] === objectBefore[key];
    let result;
    if (hasObjectAfterKey && hasObjectBeforeKey && isEqualValuesByKey) {
      result = { key: [key], value: objectBefore[key], state: states.unchanged };
    }
    if (hasObjectAfterKey && hasObjectBeforeKey && !isEqualValuesByKey) {
      const oldValue = { key: [key], value: objectBefore[key], state: states.old };
      const newValue = { key: [key], value: objectAfter[key], state: states.new };
      result = [oldValue, newValue];
    }
    if (hasObjectAfterKey && !hasObjectBeforeKey) {
      result = { key: [key], value: objectAfter[key], state: states.new };
    }
    if (!hasObjectAfterKey && hasObjectBeforeKey) {
      result = { key: [key], value: objectBefore[key], state: states.old };
    }
    return result;
  });

  return format(_.flatten(changes));
};

export default genDiff;

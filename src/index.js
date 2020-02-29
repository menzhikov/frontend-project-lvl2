import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import format from './utils';
import getParser from './parsers';

const encoding = 'utf8';
const states = { new: '+', old: '-', unchanged: ' ' };

const isValidConfigPath = (configPath) => {
  if (!_.isString(configPath) || configPath.length === 0) {
    return false;
  }

  const pathToFile = path.resolve(process.cwd(), configPath);
  if (!fs.existsSync(pathToFile) || fs.lstatSync(pathToFile).isDirectory()) {
    return false;
  }

  return true;
};

const mapToChanges = (objectAfter, objectBefore) => (key) => {
  const hasObjectAfterKey = _.has(objectAfter, key);
  const hasObjectBeforeKey = _.has(objectBefore, key);
  const hasSameKey = hasObjectAfterKey && hasObjectBeforeKey;
  const isEqualValuesByKey = objectAfter[key] === objectBefore[key];
  const isSameEntry = hasSameKey && isEqualValuesByKey;

  let result;

  if (isSameEntry) {
    result = { key: [key], value: objectBefore[key], state: states.unchanged };
  } else if (hasSameKey) {
    const oldValue = { key: [key], value: objectBefore[key], state: states.old };
    const newValue = { key: [key], value: objectAfter[key], state: states.new };
    result = [oldValue, newValue];
  } else if (hasObjectAfterKey) {
    result = { key: [key], value: objectAfter[key], state: states.new };
  } else if (hasObjectBeforeKey) {
    result = { key: [key], value: objectBefore[key], state: states.old };
  }

  return result;
};

const parseFileContent = (configPath) => {
  const parse = getParser(configPath);
  const filepath = path.resolve(process.cwd(), configPath);
  return parse(fs.readFileSync(filepath, encoding));
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  if (!isValidConfigPath(firstConfigPath) || !isValidConfigPath(secondConfigPath)) {
    return '';
  }
  const objectBefore = parseFileContent(firstConfigPath);
  const objectAfter = parseFileContent(secondConfigPath);
  const uniqKeys = _.uniq([...Object.keys(objectBefore), ...Object.keys(objectAfter)]);
  const changes = uniqKeys.map(mapToChanges(objectAfter, objectBefore));

  return format(_.flatten(changes));
};

export default genDiff;

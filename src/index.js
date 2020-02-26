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
  const objectBefore = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), firstConfig), encoding));
  const objectAfter = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), secondConfig), encoding));

  const uniqKeys = _.uniq([...Object.keys(objectBefore), ...Object.keys(objectAfter)]);

  const changes = uniqKeys.map((key) => {
    if (_.has(objectAfter, key) && _.has(objectBefore, key)
        && objectAfter[key] === objectBefore[key]) {
      return { key: [key], value: objectBefore[key], state: states.unchanged };
    }

    if (_.has(objectAfter, key) && _.has(objectBefore, key)
        && objectAfter[key] !== objectBefore[key]) {
      const oldValue = { key: [key], value: objectBefore[key], state: states.old };
      const newValue = { key: [key], value: objectAfter[key], state: states.new };
      return [oldValue, newValue];
    }

    if (_.has(objectAfter, key) && !_.has(objectBefore, key)) {
      return { key: [key], value: objectAfter[key], state: states.new };
    }

    if (!_.has(objectAfter, key) && _.has(objectBefore, key)) {
      return { key: [key], value: objectBefore[key], state: states.old };
    }

    return null;
  }).filter((x) => x !== null);

  const resultString = format(_.flatten(changes));

  return resultString;
};

export default genDiff;

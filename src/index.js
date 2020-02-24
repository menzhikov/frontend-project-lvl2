import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import format from './utils';

const encoding = 'utf8';
const states = { new: '+', old: '-', unchanged: ' ' };

const genDiff = (firstConfig, secondConfig) => {
  console.log(process.cwd());
  const pathToFile1 = path.resolve(process.cwd(), firstConfig);
  const pathToFile2 = path.resolve(process.cwd(), secondConfig);

  if ((!fs.existsSync(pathToFile1) && fs.lstatSync(pathToFile1).isDirectory())
   || (!fs.existsSync(pathToFile2) && fs.lstatSync(pathToFile2).isDirectory())) {
    return '';
  }

  const objectBefore = JSON.parse(fs.readFileSync(pathToFile1, encoding));
  const objectAfter = JSON.parse(fs.readFileSync(pathToFile2, encoding));

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

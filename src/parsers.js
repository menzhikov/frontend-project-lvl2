import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';


const extentions = {
  json: '.json', yaml: '.yaml', yml: '.yml', ini: '.ini',
};

const isNumeric = (value) => /^\d+.?\d+$/.test(value);
const getParser = (filepath) => {
  const extname = path.extname(filepath);
  let parse;
  switch (extname) {
    case extentions.json:
      parse = JSON.parse;
      break;
    case extentions.yaml:
    case extentions.yml:
      parse = yaml.safeLoad;
      break;
    case extentions.ini:
      parse = (content) => Object.entries(ini.parse(content))
        .reduce((acc, [key, value]) => {
          acc[key] = isNumeric(value) ? _.toNumber(value) : value;
          return acc;
        }, {});
      break;
    default:
      throw new Error(`Unsupported parse file extention ${extname}`);
  }

  return parse;
};

export default getParser;

import path from 'path';
import yaml from 'js-yaml';

const extentions = { json: '.json', yaml: '.yaml', yml: '.yml' };
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
    default:
      throw new Error(`Unsupported parse file extention ${extname}`);
  }

  return parse;
};

export default getParser;

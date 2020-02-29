import path from 'path';
import fs from 'fs';
import getParser from '../src/parsers';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const result = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

test('parse json', () => {
  const filename = 'after.json';
  const fileContent = readFile(filename);
  expect(getParser(filename)(fileContent)).toEqual(result);
});

test('parse yaml', () => {
  const filename = 'after.yml';
  const fileContent = readFile(filename);
  expect(getParser(filename)(fileContent)).toEqual(result);
});

test('exception test', () => {
  const filepath = './after.unknown';
  const extname = path.extname(filepath);
  expect(() => getParser(filepath)).toThrowError(new Error(`Unsupported parse file extention ${extname}`));
});

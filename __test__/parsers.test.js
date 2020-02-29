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

test.each([
  ['after.json'],
  ['after.yml'],
  ['after.ini'],
])('parse file %s', (filename) => {
  expect(getParser(filename)(readFile(filename))).toEqual(result);
});

test('exception test', () => {
  const filepath = './after.unknown';
  const extname = path.extname(filepath);
  expect(() => getParser(filepath)).toThrowError(new Error(`Unsupported parse file extention ${extname}`));
});

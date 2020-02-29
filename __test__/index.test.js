import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const result = readFile('result.txt');

test('main validation checks', () => {
  const configPath = getFixturePath('after.json');
  expect(genDiff('', '')).toEqual('');
  expect(genDiff(configPath, '')).toEqual('');
  expect(genDiff('', configPath)).toEqual('');
});

test.each([
  ['before.json', 'after.json'],
  ['before.yml', 'after.yml'],
  ['before.ini', 'after.ini'],
])('genDiff for %s and %s', (firstConfig, secondConfig) => {
  const firstConfigPath = getFixturePath(firstConfig);
  const secondConfigPath = getFixturePath(secondConfig);
  expect(genDiff(firstConfigPath, secondConfigPath)).toEqual(result);
});

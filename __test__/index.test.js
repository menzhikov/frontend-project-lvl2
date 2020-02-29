import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const result = readFile('result.txt');
test('main validation checks', () => {
  const after = getFixturePath('after.json');
  const before = getFixturePath('before.json');
  expect(genDiff('', '')).toEqual('');
  expect(genDiff(after, '')).toEqual('');
  expect(genDiff('', before)).toEqual('');
});

test('genDiff for json', () => {
  const after = getFixturePath('after.json');
  const before = getFixturePath('before.json');
  expect(genDiff(before, after)).toEqual(result);
});

test('genDiff for yaml', () => {
  const after = getFixturePath('after.yml');
  const before = getFixturePath('before.yml');
  expect(genDiff(before, after)).toEqual(result);
});

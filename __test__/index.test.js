import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const after = getFixturePath('after.json');
const before = getFixturePath('before.json');
const result = readFile('result.txt');
test('genDiff', () => {
  expect(genDiff('after.json', '')).toEqual('');
  expect(genDiff('', 'before.json')).toEqual('');
  expect(genDiff(before, after)).toEqual(result);
});

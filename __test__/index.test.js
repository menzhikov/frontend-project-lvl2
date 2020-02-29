import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const result = readFile('result.txt');
let after;
let before;

beforeEach(() => {
  after = getFixturePath('after.json');
  before = getFixturePath('before.json');
});

test('main validation checks', () => {
  expect(genDiff('', '')).toEqual('');
  expect(genDiff(after, '')).toEqual('');
  expect(genDiff('', before)).toEqual('');
});

test('genDiff for json', () => {
  expect(genDiff(before, after)).toEqual(result);
});

test('genDiff for yaml', () => {
  expect(genDiff(before, after)).toEqual(result);
});

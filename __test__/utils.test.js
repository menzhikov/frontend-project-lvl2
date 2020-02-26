import format from '../src/utils';

test('format', () => {
  const result = '{\n  + test: value\n}';
  const coll = [{ key: 'test', value: 'value', state: '+'}];
  expect(format([])).toEqual('');
  expect(format(coll)).toEqual(result);
});

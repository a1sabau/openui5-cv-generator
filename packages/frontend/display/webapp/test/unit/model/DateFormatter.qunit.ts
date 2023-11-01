import DateFormatter from 'ui5/cv/model/DateFormatter';

QUnit.module('DateFormatter');

QUnit.test('formatInterval', function (assert) {
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2020-02-01');
  const expected = '01/2020 - 02/2020';
  const actual = DateFormatter.formatInterval(startDate, endDate);
  assert.strictEqual(actual, expected);
});

QUnit.test('formatDate', function (assert) {
  assert.strictEqual(DateFormatter.formatDate(new Date('2020-01-01')), '01/2020');
});

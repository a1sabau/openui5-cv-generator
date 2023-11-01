import Main from 'ui5/cv/display/controller/Main.controller';

QUnit.module('Main controller');

QUnit.test('check for presence switchToNextjsCV', function (assert) {
  assert.strictEqual(typeof Main.prototype.switchToNextjsCV, 'function');
});

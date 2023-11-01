// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

void Promise.all([import('unit/controller/Main.qunit'), import('unit/model/DateFormatter.qunit')]).then(() => {
  QUnit.start();
});

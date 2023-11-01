// karma-ui5 usage: https://github.com/SAP/karma-ui5
module.exports = function (config) {
  config.set({
    browserConsoleLogOptions: {
      level: 'warning',
      format: '%b %T: %m',
      terminal: true,
    },
    frameworks: ['ui5'],
    browsers: ['Chrome'],
  });
};

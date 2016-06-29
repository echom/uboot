module.exports = function(baseConf) {
  var conf = {
    browsers: baseConf.browsers,
    frameworks: ['jasmine'],
    logLevel: 'warn',
    preprocessors: baseConf.preprocessors || {},
    reporters: baseConf.reporters || [],
    coverageReporter: baseConf.coverageReporter,
    singleRun: baseConf.singleRun
  };

  if (baseConf.coverageReporter) {
    if (baseConf.src.splice) {
      baseConf.src.forEach(s => {
        conf.preprocessors[s] = ['coverage'];
      });
    } else {
      conf.preprocessors[baseConf.src] = ['coverage'];
    }
  }

  conf.files = conf.files || [];
  conf.files = conf.files.concat(baseConf.src.splice ? baseConf.src : [baseConf.src]);
  conf.files = conf.files.concat(baseConf.mocks.splice ? baseConf.mocks : [baseConf.mocks]);
  conf.files = conf.files.concat(baseConf.specs.splice ? baseConf.specs : [baseConf.specs]);

  return conf;
};

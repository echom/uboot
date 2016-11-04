let fs = require('fs-extra'),
    expand = require('glob-expand');

module.exports = function(baseConf, fileName) {
  let conf = {
    source: { include: expand(baseConf.src) },
    plugins: baseConf.plugins || [],
    templates: baseConf.template || {},
    opts: {
      template: baseConf.template ? baseConf.template.path : 'templates/default',
      encoding: 'utf8',
      destination: baseConf.destination
    }
  };

  if (baseConf.opts) {
    Object.keys(baseConf.opts).forEach(function(key) {
      conf.opts[key] = baseConf.opts[key];
    });
  }

  let _fileName = fileName || '.jsdoc';
  fs.outputFile(
    _fileName,
    JSON.stringify(conf),
    err => { if (err) { throw err; } }
  );

  return _fileName;
};

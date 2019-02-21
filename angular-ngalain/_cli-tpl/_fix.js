function fix(options) {
  options.log = function (msg) {
    var that = options;
    if (that.extraArgs && that.extraArgs.debug) {
      console.log(msg);
    }
  };

  options.log(options);

  options.EntityName = options.extraArgs.EntityName || options.name;

  const fs = require('fs');
  const path = require('path');
  const tplFixPath = path.join(options._tplDir, `_${options.tplName}_fix.js`);

  options.log(tplFixPath);

  if (fs.existsSync(tplFixPath)) {
    const tplFix = require(tplFixPath);
    if (tplFix.fix) {
      const apiSwagger = fs.readFileSync('./nswag/swagger.json', 'utf8');
      const apiSwaggerJson = JSON.parse(apiSwagger);
      options.log('load swagger.json:' + apiSwaggerJson.info.title);
      tplFix.fix(options, apiSwaggerJson.paths, apiSwaggerJson.definitions);
    }
  } else {
    options.log('tplFixPath not exists.');
  }

  return new Promise((resolve) => {
    resolve();
  });
}

module.exports = {
  fix
};

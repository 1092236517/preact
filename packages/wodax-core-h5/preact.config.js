/* eslint-disable quote-props */
const path = require('path');

const webpackBasicExtend =  require('./scripts/webpack.basic.config');
const webpackDevServerExtend  =  require('./scripts/webpack.devserver.config');
const webpackOptimizationExtend =  require('./scripts/webpack.optimization.config');
const webpackDefEnvExtend =  require('./scripts/webpack.def-env.config');
const webpackOverrideExtend =  require('./scripts/webpack.override.config');


const internalPerform = (config, env/* , helpers */) => {
  if (env.production) {
    config.output = Object.assign(config.output, {
      publicPath: '/'
    });
    config.devtool = 'cheap-module-source-map';
  }

  // 默认设置成生产模式，开启生产环境默认优化
  config.mode = 'production';

  // 性能提示
  config.performance = {
    hints: false,
    maxEntrypointSize: 250*1000, // 250kb
    maxAssetSize: 250*1000,     // 250kb
  };

  // 输出设置
  // config.out.filename = 'wodax.js'

  config = webpackBasicExtend(config, env);
  config = webpackDevServerExtend(config, env);
  config = webpackOptimizationExtend(config, env);
  config = webpackDefEnvExtend(config, env);
  config = webpackOverrideExtend(config, env);

  return config;
};

export default (config, env/* , helpers */) => {
  //console.log(`env`, env);
  config = internalPerform(config, env);
  // console.log(`Webpack config =>`, config);
  return config;
};

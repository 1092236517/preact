/* eslint-disable quote-props */
const path = require("path");

module.exports = (config , env) => {
  // see: https://webpack.js.org/configuration/dev-server/
  if (process.env.NODE_ENV === "development") {

  }

  try {
    const pkg = require('../package');
    const definePlugin = config.plugins.find((plugin) => plugin.constructor.name === 'DefinePlugin');
    definePlugin.definitions = {
      ...definePlugin.definitions,
      'process': {},
      'process.env': {},
      'process.title': 'browser',
      'process_wodax_env': JSON.stringify({
        // #region NODE 当前的运行环境
        NODE_ENV: process.env.NODE_ENV,
        // #endregion

        // #region WodaX 构建相关
        /// 从运维Shell进程中读取环境变量:
        /// 变量含义，可以@叶俊青
        WODAX_BUILD_APPLICATION_NAME: process.env.WODAX_BUILD_APPLICATION_NAME || '', // 构建应用名称
        WODAX_BUILD_APPLICATION_VERSION:process.env.WODAX_BUILD_APPLICATION_VERSION || '', // 构建包Package.json版本号
        WODAX_BUILD_ENV: process.env.WODAX_BUILD_ENV || '', // 构建环境：sit, alpha, uat, prd
        WODAX_BUILD_DATETIME: process.env.WODAX_BUILD_DATETIME || '', // 构建时间
        WODAX_BUILD_GIT_URL: process.env.WODAX_BUILD_GIT_URL || '', // git 路径
        WODAX_BUILD_GIT_BRANCH: process.env.WODAX_BUILD_GIT_BRANCH || '', // git 分支名称
        WODAX_BUILD_GIT_COMMIT_ID: process.env.WODAX_BUILD_GIT_COMMIT_ID || '', // git commit id， 可以作为构建ID
        // #endregion

        // #region Wodax 全局配置
        WODAX_APP_NAME: pkg.name,
        WODAX_APP_VERSION: process.env.WODAX_BUILD_APPLICATION_VERSION || pkg.version || '1.0.0',
        // #endregion

        // #region 第三方依赖
        // #endregion

        // #region 本项目专属
        APP_TYPE: process.env.APP_TYPE || 'h5',
        // #endregion
      })
    };

    // console.log(`DefinePlugin`, definePlugin);

  } catch (e) {
    console.error(e);
  }



  return config;
};

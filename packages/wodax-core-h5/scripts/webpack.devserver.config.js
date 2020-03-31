/* eslint-disable quote-props */
const path = require("path");

module.exports = (config /* , env */) => {
  // see: https://webpack.js.org/configuration/dev-server/
  if (process.env.NODE_ENV === "development") {
    config.devServer = Object.assign(config.devServer || {}, {
      // publicPath

      // serveIndex
      serveIndex: true,

      // host
      host: "0.0.0.0",

      // port

      // allowedHosts

      // 代理配置：这里不需要专门安装 `http-proxy-middleware` 包
      // see： https://webpack.js.org/configuration/dev-server/#devserverproxy
      proxy: {
        "/api": {
          target: ["http://zp-admin.alpha.woda.ink/", "http://recruit.sit.woda.ink/", "https://zp.wodedagong.com/"][1],
          changeOrigin: true,
          logLevel: 'debug'
        }
      }

      // HTTP2 配置
    });
  }

  return config;
};

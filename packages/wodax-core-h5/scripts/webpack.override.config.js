/* eslint-disable quote-props */
const path = require('path');
const webpack = require('webpack');

const patchFileLoader = (config, env) => {
  const fileLoader = config.module.rules.find(({ loader }) => /file-loader|url-loader/.test(loader));
  fileLoader.test = /\.(woff2?|ttf|eot|jpe?g|png|gif|mp4|mov|ogg|webm)(\?.*)?$/i;
};

module.exports = (config, env) => {
  patchFileLoader(config, env);

  if (false) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        'image-webpack-loader',
      ],
    });
  }

  if (env.production) {
    config.output = Object.assign(config.output, {
      publicPath: '/index/'
    });
  }

  return config;
};

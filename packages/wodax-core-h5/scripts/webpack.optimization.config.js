/* eslint-disable quote-props */
const path = require('path');

import TerserPlugin from 'terser-webpack-plugin';

module.exports = (config, env) => {
  if (env.production) {
    // see: https://webpack.js.org/configuration/optimization/#optimizationusedexports
    config.optimization = Object.assign(
      config.optimization,
      {
        sideEffects: true,   // 针对tree shaking， 是否影响css等文件。原则上不建议使用css或者less来编写，尽量采用jss来编写
        usedExports: true,   // 开启tree shaking
        minimizer: [
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            cache: true,
            parallel: true,
            sourceMap: false,  // 不生成sourceMap
            terserOptions: {
              parse: { // see: https://github.com/terser/terser#parse-options
                bare_returns: false,
                ecma: 8,
                html5_comments: true,
                shebang: true,
              },
              compress: { // see: https://github.com/terser/terser#compress-options
                arrows: true,
                arguments: false,
                booleans: true,
                booleans_as_integers: false,
                collapse_vars: true,
                comparisons: true,
                computed_props: true,
                conditionals: true,
                dead_code: true,
                defaults: true,
                directives: true,
                drop_console: true, // 是否删除console.*  默认是不删除，default: false
                drop_debugger: true,
                ecma: 5,
                evaluate: true,
                expression: false,
                global_defs: {},
                hoist_funs: false,
                hoist_props: true,
                hoist_vars: false,
                if_return: true,
                inline: true,
                join_vars: true,
                keep_classnames: false,
                keep_fargs: true,
                keep_fnames: false,
                keep_infinity: false,
                loops: true,
                module: false,
                negate_iife: true,
                passes: 1,
                properties: true,
                pure_funcs: null,
                pure_getters: 'strict',
                reduce_vars: true,
                sequences: true,
                side_effects: true,
                switches: true,
                toplevel: false,
                top_retain: null,
                typeofs: true,
                unsafe: false,
                unsafe_arrows: false,
                unsafe_comps: false,
                unsafe_Function: false,
                unsafe_math: false,
                unsafe_methods: false,
                unsafe_proto: false,
                unsafe_regexp: false,
                unsafe_undefined: false,
                unused: true,
                warnings: false,
              },
              mangle: {
                // mangle options
                eval: false,
                keep_classnames: false,
                keep_fnames: false,
                module: false,
                reserved: [],
                toplevel: false,
                safari10: false,

                // Note `mangle.properties` is `false` by default.
                // 特别要注意，这里需要设置成false,
                // see: https://github.com/terser/terser#mangle-properties-options
                properties: false,
              },
              output: { // see: https://github.com/terser/terser#output-options
                ascii_only: false,
                beautify: false,
                braces: false,
                comments: false,
                ecma: 5,
                indent_level: 2,
                indent_start: 0,
                inline_script: true,
                keep_quoted_props: false,
                max_line_len: false,
                preamble: null,
                quote_keys: false,
                quote_style: 0,
                safari10: true, // 是否解决 Safari 10/11 await bug. default: false
                semicolons: true,
                shebang: true,
                webkit: false,  // 是否开启WebKit bug的变动方法。 default: false
                wrap_iife: false,
                wrap_func_args: true
              },
              ecma: 5, // specify one of: 5, 6, 7 or 8
              keep_classnames: false,
              keep_fnames: false,
              ie8: false,
              module: false,
              nameCache: null, // or specify a name cache object
              safari10: true,
              toplevel: false,
              warnings: false,
            },
          }),
        ],
        splitChunks: {
          chunks: 'all',    // 表示显示块的范围,可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all
          minSize: 20*1000, // 30kb, 这是官方要求的最低值
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 4, // Maximum number of parallel requests when loading chunks on demand would be lower or equal to 6
          maxInitialRequests: 6, // Maximum number of parallel requests at initial page load would be lower or equal to 4
          automaticNameDelimiter: '~',
          automaticNameMaxLength: 30,
          cacheGroups: {
            components: {
              name: 'components',
              test: /[\\/]components|icons|styles|\.scss|\.less$/,
              chunks: 'all',
              priority: 50,
            },
            pages: {
              test: /[\\/]pages/,
              chunks: 'initial',
              name(module, chunks, cacheGroupKey) {
                const sep = require('path').sep;
                const moduleFileName = module.identifier().split(`${sep}`).reduceRight(item => item);
                const allChunksNames = chunks.map((item) => item.name).join('~');
                return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
              },
              priority: 40,
            },
            vendors: {
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              // cacheGroupKey here is `commons` as the key of the cacheGroup
              name(module, chunks, cacheGroupKey) {
                const sep = require('path').sep;
                const moduleFileName = module.identifier().split(`${sep}`).reduceRight(item => item);
                const allChunksNames = chunks.map((item) => item.name).join('~');
                return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
              },
              priority: 30,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              chunks: 'async',
              priority: -20,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      }
    )
  }

  return config;
};

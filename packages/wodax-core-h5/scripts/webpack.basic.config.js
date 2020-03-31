/* eslint-disable quote-props */
const path = require('path');

module.exports = (config, env) => {
	config.resolve.extensions.push('.css');
	config.resolve.extensions.push('.less');

	config.resolve.alias = Object.assign(
		config.resolve.alias,
		{
			'@': path.join(__dirname, '../src'),
			'pages': path.join(__dirname, '../src/pages'),
			'styles': path.join(__dirname, '../src/styles'),
			'icons': path.join(__dirname, '../src/icons'),
			'components': path.join(__dirname, '../src/components'),
			'react': 'preact/compat',
			'react-dom': 'preact/compat'
		}
  );

	return config;
};

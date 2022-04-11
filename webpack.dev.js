const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

// @ts-expect-error
module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'),
        publicPath: '/public'
      },
    },
});

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// @ts-expect-error
module.exports = merge(common, {
    mode: 'production',
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
});

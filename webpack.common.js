const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: ["./src/index.js", "./src/styles.scss"],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.scss$/, use: [
                    {
                        loader: 'style-loader',
                        options: {
                            insert: 'head', // insert style tag inside of <head>
                            injectType: 'singletonStyleTag' // this is for wrap all your style in just one style tag
                        },
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' }
            ]
        }),
        new CompressionPlugin({
            test: /.*.js$/,
        })
    ]
};

/* eslint-env node */
const { resolve } = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');

// Options.
const browsers = [
    'last 2 Chrome versions',
    'last 2 FireFox versions',
];

const isProduction = process.env.NODE_ENV === 'production';
const babelOptions = {
    cacheDirectory: true,
    presets: [
        [
            'env', {
                modules: false,
                targets: {
                    browsers,
                },
            },
        ],
    ],
    plugins: [
        ['transform-object-rest-spread', { useBuiltIns: true }],
    ],
};
const plugins = [
    new WebpackNotifierPlugin({
        title: 'Simulator',
        alwaysNotify: true,
        excludeWarnings: true,
    }),
];

module.exports = {
    devtool: isProduction ? false : 'cheap-module-source-map',
    performance: {
        hints: false,
    },
    stats: {
        hash: false,
        version: false,
        timings: false,
        children: false,
        warnings: false,
        chunks: false,
        modules: false,
        reasons: false,
        source: false,
        publicPath: false,
    },
    context: resolve(__dirname, 'src'),
    entry: {
        main: './app.js',
    },
    output: {
        path: resolve(__dirname, 'public', 'js'),
        filename: './app.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: babelOptions,
            },
        ],
    },
    resolve: {
        modules: [
            resolve(__dirname, 'src'),
            'node_modules',
        ],
    },
    plugins,
};

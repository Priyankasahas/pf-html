var path = require('path'),
    assets_path = path.join('app', 'assets', 'javascripts'),
    webpack = require('webpack');

var config = {
    debug: true,
    displayErrorDetails: true,
    outputPathinfo: true,
    devtool: 'sourcemap',
    context: path.resolve(assets_path),
    entry: {
        'private': './private-entry.js'
    },
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve(assets_path)
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: path.resolve(assets_path)
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /profarmer.js$/, exclude: /node_modules/, loader: 'expose?$profarmer!babel-loader' }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('common', 'common-bundle.js')
    ]
};

module.exports = config;

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const proxy = require('./package.json').proxy

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash:8].js',
        publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './static/index.html' }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        providedExports: true,
        runtimeChunk: true,
    },
    devServer: {
        historyApiFallback: true,
        port: 5000,
        static: {
            directory: path.resolve(__dirname, 'static'),
        },
        proxy: {
            context: ['/api'],
            target: proxy,
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
            progress: true,
        },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.(c|le)ss$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
        ],
    },
}
